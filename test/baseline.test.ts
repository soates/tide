import test from 'ava';
import axios from 'axios';

import serverInit from '../example/server-core';

let endpoint = 'http://localhost:8080/api/todo';

test.before(t => {

    serverInit();

});

test('Create todo', async t => {

    return axios.post(endpoint, { name: 'test-todo' }).then(response => {
        t.is(response.status, 200);
    }).catch(error => {
        t.fail(error);
    });

});

test('Get All todo items', async t => {

    return axios.get(endpoint).then(response => {
        t.is(response.status, 200);
        t.is(response.data.length, 1);
    }).catch(error => {
        t.fail(error);
    });

});

test('Get todo by query', async t => {

    return axios.get(endpoint + `/test-todo`).then(response => {
        t.is(response.status, 200);
        t.is(response.data.name, 'test-todo');
    }).catch(error => {
        t.fail(error);
    });

});
