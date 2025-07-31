// Cloudflare Pages Functions
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);          // 去掉前导 /

    // 1) /list.json → 直接返回静态文件
    if (path === 'list.json') {
      return fetch(`${url.origin}/list.json`);
    }

    // 2) /random 或 /A  随机重定向
    const list = await (await fetch(`${url.origin}/list.json`)).json(); // ["A/1.png", ...]

    let candidates = list;
    if (path && path !== 'random') {             // /A  /B …
      candidates = list.filter(f => f.startsWith(path + '/'));
    }
    if (!candidates.length) return new Response('Not found', { status: 404 });

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    return Response.redirect(`${url.origin}/${pick}`, 302);
  }
}
