import React, { SyntheticEvent } from "react";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";
import history from '../utilities/history'

interface LoginProps {
    authService: AuthService,
    setUser: (user: User) => void
}

interface LoginState {
    userName: string,
    password: string,
    loginAttempted: boolean,
    loginSuccesfull: boolean
}

interface CustomEvent {
    target: HTMLInputElement
}
export class Login extends React.Component <LoginProps, LoginState> {
    state: LoginState = {
        userName: '',
        password: '',
        loginAttempted: false,
        loginSuccesfull: false
    }

    private setUserName(event: CustomEvent) {   // quando voce colocar o username
        this.setState({userName: event.target.value})
    }

    private setPassword(event: CustomEvent) {   // quando voce colocar o username
        this.setState({password: event.target.value})
    }

    private async handleSubmit(event: SyntheticEvent) { // ao apertar no botao de login, verifica se o usuario e senha existem e estao corretos
        event.preventDefault();
        this.setState({loginAttempted: true})
        const result = await this.props.authService.login( 
            this.state.userName,
            this.state.password
        )
        if (result) {
            this.setState({loginSuccesfull: true}) // se existirem esses dados, simplesmente faz o login
            this.props.setUser(result)
            //console.log(result)
            history.push('/profile')
        }
        else {
            this.setState({loginSuccesfull: false})
            //console.log('wrong login') // se nao existir, mostra uma mensagem de erro
        }
    }

    render() {
        let loginMessage: any;
        if (this.state.loginAttempted) {    // no momento isso apenas imprime na tela
            if(this.state.loginSuccesfull) {   // futramente vai aparecer em um warning
                loginMessage = <label>Login successful</label>
            }
            else {
                loginMessage = <label>Login failed</label>
            }
        }

        return (
            <div>
                <h2>Please login</h2>
                <form onSubmit={e => this.handleSubmit(e)}>
                    <input value={this.state.userName} onChange={e => this.setUserName(e)}/><br/>
                    <input value={this.state.password} onChange={e => this.setPassword(e)} type='password'/><br/>
                    <input type='submit' value='Login'/>
                </form>
                {loginMessage}
          </div>
        )
      }
}