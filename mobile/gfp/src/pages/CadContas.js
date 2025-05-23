import React, {useState, useEffect, useLayoutEffect } from "react";
import {View, Text, TextInput, Switch, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";   
import Estilos, { corPrincipal } from "../styles/Estilos";
import { enderecoServidor } from "../utils";
// import { navigation } from "@react-navigation/native";


export default function CadContas({navigation, route }) {
    const [ inputNome, setInputNome ] = useState('');
    const [ inputTipo, setInputTipo ] = useState('');
    const [ inputSaldo, setInputSaldo ] = useState('');
    const [ inputContaPadrao, setInputContaPadrao ] = useState('');
    const [ usuario, setUsuario ] = useState({});
    
    useEffect(() => {
            buscarUsuarioLogado();
        }, [])
    
    const buscarUsuarioLogado = async () => {
      const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
      if (usuarioLogado) {
        setUsuario(JSON.parse(usuarioLogado));
      }else {
        navigation.navigate('Login');
      }
    }

    const botaoSalvar = async () => {
        try {
            const dados = {
                nome: inputNome,
                tipo_conta: inputTipo,
                saldo: inputSaldo,
                conta_padrao: inputContaPadrao,
                ativo: true
            }
            const endpoint = `${enderecoServidor}/contas`
            const metodo = 'POST'

            if (route.params && route.params.Conta){
                endpoint = `${enderecoServidor}/contas/${route.params.Conta.id_conta}`
                metodo = 'PUT'
            }
            
            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify(dados)
            })
    
            if (resposta.ok) {
                alert('Conta cadastrada com sucesso!')
                navigation.goBack()
            }
    
        } catch (error) {
            console.error('Erro ao salvar conta:', error);
        }
    }
    useLayoutEffect (() => {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity onPress={botaoSalvar}>
                        <MaterialIcons name="save" size={28} color="#fff"
                            style={{marginRight: 15}} />
                    </TouchableOpacity>
                )
            })
        }, [navigation, inputNome, inputTipo, inputSaldo, inputContaPadrao])

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text>Nome da Conta:</Text>
                <TextInput placeholder="Digite o nome da Conta"
                    value={inputNome} onChangeText={setInputNome}
                    style={Estilos.inputCad} />
                <Text>Tipo da Conta:</Text>
                <TextInput placeholder="Digite o tipo da Conta"
                    value={inputTipo} onChangeText={setInputTipo}
                    style={Estilos.inputCad} />
                <Text>Saldo:</Text>
                <TextInput placeholder="Digite o saldo"
                    value={inputSaldo} onChangeText={setInputSaldo}
                    style={Estilos.inputCad} keyboardType="numeric" />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Switch value={inputContaPadrao}
                        onValueChange={setInputContaPadrao} />
                    <Text>Conta Padrão</Text>
                </View>
            </View>
            <Text>Cadastro de contas</Text>
        </View>
    )
}