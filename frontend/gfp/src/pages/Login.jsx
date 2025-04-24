import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { enderecoServidor } from "../utils";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function botaoEntrar(e) {
        e.preventDefault();

        try {
            if (email === "" || senha === "") {
                throw new Error("Preencha todos os campos!");
            }
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email, 
                    senha: senha 
                }),
            });
            if (!resposta.ok) {
                const dados = await resposta.json();
                localStorage.setItem("UsuarioLogado", JSON.stringify(dados));
                setMensagem("Login bem-sucedido!");
                navigate("/principal");
            } else {
                setMensagem("Email ou senha incorretos!");
                throw new Error("Email ou senha incorretos!");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert(error.message);
        }
    }

    function botaoLimpar() {
        setEmail("");
        setSenha("");
        setMensagem("");
    }

    const estilos = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#2C3E50", // Fundo principal
            color: "#FFFFFF", // Cor do texto
            fontFamily: "Arial, sans-serif",
        },
        box: {
            backgroundColor: "#34495E", // Fundo secundário
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "300px",
            textAlign: "center",
        },
        logo: {
            width: "150px",
            marginBottom: "20px",
        },
        inputGroup: {
            marginBottom: "15px",
            textAlign: "left",
        },
        input: {
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
        },
        button: {
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#0056B3  ", // Cor principal
            color: "#FFFFFF", // Cor do texto do botão
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
        },
        buttonHover: {
            backgroundColor: "#0056B3 ", // Cor secundária
        },
        mensagem: {
            marginTop: "15px",
            color: "red",
            fontSize: "14px",
        },
    };

    return (
        <div style={estilos.container}>
            <h1>Tela de Login</h1>
            <div style={estilos.box}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1024px-SENAI_S%C3%A3o_Paulo_logo.png"
                    alt="Logo SENAI"
                    style={estilos.logo}
                />
                <h2>Login</h2>
                <div>
                    <div style={estilos.inputGroup}>
                        <label>Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Digite seu email"
                            required
                            style={estilos.input}
                        />
                    </div>
                    <div style={estilos.inputGroup}>
                        <label>Senha</label>
                        <input
                            onChange={(e) => setSenha(e.target.value)}
                            value={senha}
                            type="password"
                            placeholder="Digite sua senha"
                            required
                            style={estilos.input}
                        />
                    </div>
                    <button onClick={botaoEntrar} style={estilos.button}>
                        Entrar
                    </button>
                    <button onClick={botaoLimpar} style={estilos.button}>
                        Limpar
                    </button>
                </div>
                <p style={estilos.mensagem}>{mensagem}</p>
            </div>
        </div>
    );
}