// Посредник между приложением учёта материалов и ИИ. Приложение присылает
// фото упаковки или этикетки, воркер спрашивает у модели, что это за
// материал и сколько его, и возвращает разобранный ответ. Ключ Anthropic
// хранится секретом воркера: в веб-страницу его положить нельзя -- её
// исходник открыт любому.
//
// Пропуск -- код доступа (секрет ACCESS_CODE), который вводится один раз в
// настройках приложения. Без него любой, кто узнал адрес, тратил бы чужой
// баланс.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

// Совпадает со списком единиц в приложении. Всё прочее превращается в шт.
const UNITS = ['шт', 'кг', 'г', 'т', 'л', 'мл', 'м', 'м²', 'м³', 'уп', 'рул', 'меш', 'лист'];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });
}

// Сравнение без раннего выхода, чтобы код нельзя было подбирать по времени
// ответа.
function sameCode(a, b) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    diff |= (x[i] || 0) ^ (y[i] || 0);
  }
  return diff === 0;
}

// --- суточный предел ----------------------------------------------------

async function useQuota(env) {
  if (!env.SCAN_QUOTA) return;
  const limit = Number(env.DAILY_LIMIT || '300');
  const key = new Date().toISOString().slice(0, 10);
  const used = Number((await env.SCAN_QUOTA.get(key)) || '0');
  if (used >= limit) {
    throw new HttpError(429, 'На сегодня распознаваний больше нет, попробуйте завтра');
  }
  await env.SCAN_QUOTA.put(key, String(used + 1), { expirationTtl: 172800 });
}

// --- запрос к модели ----------------------------------------------------

const TOOL = {
  name: 'record_materials',
  description:
    'Записать материалы, которые видны на снимке. Если материала не видно, '
    + 'вернуть пустой список.',
  input_schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description:
                'Название материала так, как его запишет кладовщик: тип, марка, '
                + 'ключевой размер или характеристика. Например «Цемент М500 Д0», '
                + '«Гипсокартон Knauf 12,5 мм», «Саморез 3,5×25». Без веса '
                + 'упаковки, штрихкодов и рекламных слов. До 80 символов.',
            },
            quantity: {
              type: 'number',
              description:
                'Сколько единиц материала видно на снимке: число мешков, '
                + 'коробок, листов, штук. Если на снимке одна упаковка -- 1.',
            },
            unit: {
              type: 'string',
              enum: UNITS,
              description:
                'В чём считать quantity. Мешки -- «меш», коробки и пачки -- '
                + '«уп», рулоны -- «рул», листы -- «лист», отдельные предметы -- '
                + '«шт». Вес или объём одной упаковки сюда не относится.',
            },
            package: {
              type: 'string',
              description:
                'Фасовка одной упаковки, если она написана: «50 кг», «10 л», '
                + '«200 шт». Если не видно -- пустая строка.',
            },
            confidence: {
              type: 'number',
              description: 'Насколько уверенно прочитано название, от 0 до 1.',
            },
          },
          required: ['name', 'quantity', 'unit'],
        },
      },
    },
    required: ['items'],
  },
};

const SYSTEM = [
  'Вы помогаете вести складской учёт строительных и хозяйственных материалов. ',
  'Человек фотографирует упаковку, этикетку, бирку или сам материал, а вы ',
  'читаете надписи и определяете, что это.',
  '',
  '- Главное -- название с маркой и характеристикой, по которому материал ',
  '  потом найдут на складе. Производителя пишите, если он крупно на упаковке.',
  '- Если на снимке несколько одинаковых упаковок -- это одна позиция с ',
  '  соответствующим количеством. Разные материалы -- разные позиции.',
  '- Надписи на другом языке переводите на русский, марки и бренды оставляйте ',
  '  как есть.',
  '- Если надпись не читается, опишите материал по виду и поставьте низкую ',
  '  уверенность. Ничего не выдумывайте.',
].join('\n');

function clampItems(raw) {
  const out = [];
  for (const item of Array.isArray(raw) ? raw : []) {
    const name = String(item?.name ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (!name) continue;
    const quantity = Math.abs(Number(item?.quantity));
    const confidence = Number(item?.confidence);
    out.push({
      name,
      quantity: Number.isFinite(quantity) && quantity > 0
        ? Math.round(quantity * 1000) / 1000
        : 1,
      unit: UNITS.includes(item?.unit) ? item.unit : 'шт',
      package: String(item?.package ?? '').trim().slice(0, 30),
      confidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 1,
    });
    if (out.length >= 20) break;
  }
  return out;
}

async function askModel(env, image) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: env.MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: image.mime, data: image.data },
            },
            {
              type: 'text',
              text: 'Определите материал на снимке и вызовите record_materials.',
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('anthropic', res.status, detail.slice(0, 500));
    if (res.status === 429) {
      throw new HttpError(429, 'Сервис распознавания занят, попробуйте позже');
    }
    throw new HttpError(502, 'Не удалось распознать снимок');
  }

  const body = await res.json();
  const block = (body.content || []).find((b) => b.type === 'tool_use');
  if (!block) throw new HttpError(502, 'Не удалось распознать снимок');
  return block.input || {};
}

// --- обработчик ---------------------------------------------------------

async function handleScan(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    throw new HttpError(500, 'Воркер не настроен: нет ключа ANTHROPIC_API_KEY');
  }
  if (!env.ACCESS_CODE) {
    throw new HttpError(500, 'Воркер не настроен: нет кода ACCESS_CODE');
  }

  const auth = request.headers.get('Authorization') || '';
  const code = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!code || !sameCode(code, env.ACCESS_CODE)) {
    throw new HttpError(401, 'Неверный код доступа');
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    throw new HttpError(400, 'Тело запроса не разобрано');
  }

  const data = typeof payload?.image === 'string' ? payload.image : '';
  const mime = ALLOWED_MIME.includes(payload?.mime) ? payload.mime : 'image/jpeg';
  if (!data) throw new HttpError(400, 'Пустой снимок');
  if (data.length > MAX_IMAGE_BYTES) throw new HttpError(413, 'Снимок слишком большой');

  await useQuota(env);

  const result = await askModel(env, { data, mime });
  return json({ items: clampItems(result.items) });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method === 'GET') {
      return new Response('materials-scan ok\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CORS },
      });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Метод не поддерживается' }, 405);
    }
    try {
      return await handleScan(request, env);
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status);
      }
      console.error('unhandled', error && error.stack);
      return json({ error: 'Внутренняя ошибка' }, 500);
    }
  },
};
