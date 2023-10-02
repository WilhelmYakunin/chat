import { expect } from 'chai';

import { get, post, put, delet } from './index';

describe('API methods tests', () => {
  const url = 'https://jsonplaceholder.typicode.com/posts';

  it('Get requests data', async () => {
    const res = await get(url.concat('/10'), {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      tries: 0,
    });

    const properRes = {
      userId: 1,
      id: 10,
      title: 'optio molestias id quia eum',
      body: 'quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error',
    };

    expect(JSON.stringify(res)).to.equal(JSON.stringify(properRes));
  });

  it('Post sends data', async () => {
    const data = { body: 'ipso yure lore' };
    const res = await post(url, {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: JSON.stringify(data),
      tries: 0,
    });

    const properRes = { body: 'ipso yure lore', id: 101 };

    expect(JSON.stringify(res)).to.equal(JSON.stringify(properRes));
  });

  it('Put requests changes server data', async () => {
    const data = { id: 1, title: 'foo', body: 'bar', userId: 1 };

    const res = await put('https://jsonplaceholder.typicode.com/posts/1', {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      data: JSON.stringify(data),
      tries: 0,
    });

    expect(JSON.stringify(res)).to.equal(JSON.stringify(data));
  });

  it('Delete requests is undefined', async () => {
    const res = await delet(url.concat('/5'), {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
      tries: 0,
    });

    expect(JSON.stringify(res)).to.equal(JSON.stringify({}));
  });
});
