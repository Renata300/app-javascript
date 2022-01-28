//import { Login } from '../../src/components/Login';
import * as ReactDOM from 'react-dom';
import { Login } from '../../components/Login';
import { fireEvent, waitFor } from '@testing-library/react';
import { User } from '../../model/Model';
import history from '../../utilities/history';

const someUser: User = {
    userName: 'someUser',
    email: 'someEmail'
}

describe ('Login component test suite', () => {
    let container: HTMLDivElement;
    const authServiceMock = {
        login: jest.fn()
    }
    const setUserMock = jest.fn();
    const historyMock = history;
    history.push = jest.fn();

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(
            <Login authService={authServiceMock as any} setUser={setUserMock}/>, container
            )

    })

    afterEach(() => {
        document.body.removeChild(container);
        container.remove();
        jest.clearAllMocks();
    })

    test('Should have a login page', () => {
        const title = document.querySelector('h2');
        const inputs = document.querySelectorAll('input');
        const label= document.querySelector('label');

        expect(title?.textContent).toBe('Please login');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        expect(inputs[2].value).toBe('Login');
        expect(label).not.toBeInTheDocument();
    })

    test('Should pass credentials correctly', () => {
        const inputs = document.querySelectorAll('input');
        const loginInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];
        
        fireEvent.change(loginInput, {target: {value: 'someUser'}});
        fireEvent.change(passwordInput, {target: {value: 'somePass'}});
        fireEvent.click(loginButton);

        expect(authServiceMock.login).toBeCalledWith(
            'someUser',
            'somePass'
        )
    });

    test('Should have correctly handles login success', async () => {
        authServiceMock.login.mockResolvedValueOnce(someUser);
        const inputs = document.querySelectorAll('input');
        const loginInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        fireEvent.change(loginInput, {target: {value: 'someUser'}});
        fireEvent.change(passwordInput, {target: {value: 'somePass'}});
        fireEvent.click(loginButton);

        const statusLabel = await waitFor(() => container.querySelector('label'));
        expect(statusLabel).toBeInTheDocument();
        expect(statusLabel).toHaveTextContent('Login successful');
        expect(setUserMock).toBeCalledWith(someUser);
        expect(history.push).toBeCalledWith('/profile');
    })

    test('Should have correctly handles login fail', async () => {
        authServiceMock.login.mockResolvedValueOnce(undefined);
        const inputs = document.querySelectorAll('input');
        const loginInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        fireEvent.change(loginInput, {target: {value: 'someUser'}});
        fireEvent.change(passwordInput, {target: {value: 'somePass'}});
        fireEvent.click(loginButton);

        const statusLabel = await waitFor(() => container.querySelector('label'));
        expect(statusLabel).toBeInTheDocument();
        expect(statusLabel).toHaveTextContent('Login failed');
    })
})

// no video 34 é mostrado como fazer o debbug dos testes