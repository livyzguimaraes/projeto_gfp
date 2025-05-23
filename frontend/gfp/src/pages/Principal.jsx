import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Principal(){
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const buscarUsuarioLogado = async() => {
            const usuarioLogado = await localStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            }else {
                navigate('/');
            }
        };
        buscarUsuarioLogado();
    }, []);
    const botaoLogout = () => {
        try{
        localStorage.removeItem('UsuarioLogado');
        navigate('/')
    } catch (error) {
        console.error('Erro ao deslogar:', error)
    }
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', 
                    justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Usuario: {usuario.nome}</p>
                <button onClick={botaoLogout} >Sair</button>
            </div>
            <div style={{padding: '20px'}} >
                <h2>Principal</h2>
            </div>         
        </div>
    )
}