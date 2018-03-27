// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the 'Software'), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

describe('Add new user: put /api/v1/user', () => {
  beforeEach(() => {

    // Mock etcd2
    nock(etcdHosts)
      .put('/v2/keys/users', { 'dir': 'true' })
      .reply(200, {
        'action': 'set',
        'node': {
          'key': '/users',
          'dir': true,
          'modifiedIndex': 1,
          'createdIndex': 1
        }
      });

    nock(etcdHosts)
      .get('/v2/keys/users/new_user')
      .reply(200, {
        'errorCode': 100,
        'message': 'Key not found',
        'cause': '/test',
        'index': 10
      });

    nock(etcdHosts)
      .put('/v2/keys/users/new_user', { 'dir': 'true' })
      .reply(200, {
        'action': 'set',
        'node': {
          'key': '/users/new_user',
          'dir': true,
          'modifiedIndex': 2,
          'createdIndex': 2
        }
      });

    nock(etcdHosts)
      .put('/v2/keys/users/new_user/passwd', { 'value': '8507b5d862306d5bdad95b3d611b905ecdd047b0165ca3905db0d861e76bce8f3a8046e64379e81f54865f7c41b47e57cec887e5912062211bc9010afea8ab12' })
      .reply(200, {
        'action': 'set',
        'node': {
          'key': '/users/new_user/password',
          'value': '8507b5d862306d5bdad95b3d611b905ecdd047b0165ca3905db0d861e76bce8f3a8046e64379e81f54865f7c41b47e57cec887e5912062211bc9010afea8ab12',
          'modifiedIndex': 3,
          'createdIndex': 3
        }
      });

    nock(etcdHosts)
      .put('/v2/keys/users/new_user/admin', { 'value': 'true' })
      .reply(200, {
        'action': 'set',
        'node': {
          'key': '/users/new_user/admin',
          'value': 'true',
          'modifiedIndex': 4,
          'createdIndex': 4
        }
      });

    newUserTemplate = JSON.stringify({
      'username': '{{username}}',
      'password': '{{password}}',
      'admin': '{{admin}}',
      'modify': '{{modify}}',
    });
  });

  //
  // Get a valid token that expires in 60 seconds.
  //

  const validToken = global.jwt.sign({ username: 'new_user', admin: true }, process.env.JWT_SECRET, { expiresIn: 60 });
  const invalidToken = '';

  //
  // Positive cases
  //

  it('Case 1 (Positive): Add a admin user.', (done) => {
    global.chai.request(global.server)
      .put('/api/v1/user')
      .set('Authorization', 'Bearer ' + validToken)
      .send(JSON.parse(global.mustache.render(newUserTemplate, { 'username': 'new_user', 'password': '123456', 'admin': true, 'modify': false })))
      .end((err, res) => {
        console.log(res.body.message);
        // global.chai.expect(res, 'status code').to.have.status(202);
        // global.chai.expect(res, 'response format').be.json;
        // global.chai.expect(res.body.message, 'response message').equal('update job new_job successfully');
        done();
      });
  });

});
