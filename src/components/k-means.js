import React, {useContext, useState} from "react";
import "../styles/k-means.css"
import {DataTraining} from './dataTraining';
import {basesIni, formatCenters, formatCentersFinal, formatResult, roundDecimals} from "../javascripts/formatData"
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

export default function Kmeans() {
    let irisSetosa = [];
    let irisVersicolor = [];
    let centrosSetosa = [];
    let centrosVersi = [];
    let basesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let defaultTolerancia = 0.01;
    let defaultPesoExponencial = 2;


    const {data} = useContext(DataTraining);
    const [tolerancia, setTolerancia] = useState(defaultTolerancia);
    const [pesoExponencial, setPesoExponencial] = useState(defaultPesoExponencial);
    const [centrosIniciales, setCentrosIniciales] = useState(basesIni(basesIniciales));
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);
    const [newExample, setNewExample] = useState([]);
    const [allExamples, setAllExamples] = useState([]);
    const [result, setResult] = useState([]);


    const items = () =>{
        let array = [];
        for(let item in data){
            let formatData = data[item].values;
            formatData = formatData.map(element => {
                return "\n".concat(element.toString());
            });
            array.push(
                <TextField id="outlined-basic" fullWidth label={item} multiline maxRows={6} value={formatData} variant="outlined" />,
                <br />,
                );
        }
        return array
    }

    const setField1 = (e) =>  {
        setTolerancia({[e.target.name]: e.target.value})
    }

    const setField2 = (e) =>  {
        setPesoExponencial({[e.target.name]: e.target.value})
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setNewExample(e.target[0].value);
        setAllExamples([...allExamples, "\n" + (allExamples.length+1) + ") " +e.target[0].value])
    }

    const defaultValuesBases = () => {
        setCentrosIniciales(basesIni(basesIniciales));
    }

    const randomValuesBases = () => {
        let numCentros =  centrosIniciales.length;
        let numCoordenadas = centrosIniciales[0].slice(5,centrosIniciales[0].length-1);
        numCoordenadas = numCoordenadas.toString().split(",");
        numCoordenadas = numCoordenadas.length;
        let aux = {};
        for(let i = 1; i <= numCentros; i++){
            aux[i] = new Array(numCoordenadas);
            for(let j = 0; j < numCoordenadas; j++) {
                aux[i][j] = roundDecimals(Math.random()* 10, 2);
            }
        }
        setCentrosIniciales(basesIni(aux));
    }

    const defaultValuesParams = () => {
        setTolerancia(defaultTolerancia);
        setPesoExponencial(defaultPesoExponencial);
    }

    const randomValuesParams = () => {
        setTolerancia(roundDecimals(Math.random(), 4) * 2 + 0.1);
        setPesoExponencial(roundDecimals(Math.random()* 5 + 1.1 ,4));
    }

    const execute_kmeans = () => {
        if(data.length !== 0) kmeans();
        else alert("Primero introduce un fichero de datos");
    }

    const kmeans = () => {
        let aux2;
        let aux1;
        let djVersicolor;
        let djSetosa;
        let res;

        irisSetosa = data["Iris-setosa"]["values"];
        irisVersicolor = data["Iris-versicolor"]["values"];
        centrosSetosa = formatCenters(centrosIniciales[0]);
        centrosVersi = formatCenters(centrosIniciales[1]);
        let salir = false;
        let iteracion = 1;
        while (!salir) {
            const exponente = 1 / (pesoExponencial - 1);
            const valores_d = [];
            for (let i = 0; i < irisSetosa.length; i++) {
                res = [];
                djSetosa = 0;
                djVersicolor = 0;
                for (let j = 0; j < irisSetosa[i].length; j++) {
                    djSetosa += Math.pow(irisSetosa[i][j] - centrosSetosa[j], 2);
                    djVersicolor += Math.pow(irisSetosa[i][j] - centrosVersi[j], 2);
                }
                res.push(djSetosa);
                res.push(djVersicolor);
                valores_d.push(res);
            }


            for (let i = 0; i < irisVersicolor.length; i++) {
                res = [];
                djSetosa = 0;
                djVersicolor = 0;
                for (let j = 0; j < irisVersicolor[i].length; j++) {
                    djSetosa += Math.pow(irisVersicolor[i][j] - centrosSetosa[j], 2);
                    djVersicolor += Math.pow(irisVersicolor[i][j] - centrosVersi[j], 2);
                }
                res.push(djSetosa);
                res.push(djVersicolor);
                valores_d.push(res);
            }

            const MatrizProbabilidadesK = [];
            const sumasDeterminantes = [];
            for (let i = 0; i < valores_d.length; i++) {
                let auxi = 0;
                for (let j = 0; j < 2; j++) {
                    auxi += Math.pow(1 / valores_d[i][j], exponente)
                }
                sumasDeterminantes.push(auxi);
            }


            for (let i = 0; i < valores_d.length; i++) {
                const aux = [];
                res = Math.pow(1 / valores_d[i][0], exponente) / sumasDeterminantes[i];
                aux.push(res);
                aux.push(1 - res);
                MatrizProbabilidadesK.push(aux);
            }

            const nuevoCentroSetosa = [];
            const nuevoCentroVersi = [];

            for (let i = 0; i < centrosSetosa.length; i++) {
                aux1 = 0;
                aux2 = 0;
                for (let j = 0; j < irisSetosa.length; j++) {
                    aux1 += Math.pow(MatrizProbabilidadesK[j][0], pesoExponencial) * irisSetosa[j][i];
                    aux2 += Math.pow(MatrizProbabilidadesK[j][0], pesoExponencial);
                }
                for (let j = 0; j < irisVersicolor.length; j++) {
                    aux1 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][0], pesoExponencial) * irisVersicolor[j][i];
                    aux2 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][0], pesoExponencial);
                }
                nuevoCentroSetosa.push(aux1 / aux2);
            }

            for (let i = 0; i < centrosVersi.length; i++) {
                aux1 = 0;
                aux2 = 0;
                for (let j = 0; j < irisSetosa.length; j++) {
                    aux1 += Math.pow(MatrizProbabilidadesK[j][1], pesoExponencial) * irisSetosa[j][i];
                    aux2 += Math.pow(MatrizProbabilidadesK[j][1], pesoExponencial);
                }
                for (let j = 0; j < irisVersicolor.length; j++) {
                    aux1 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][1], pesoExponencial) * irisVersicolor[j][i];
                    aux2 += Math.pow(MatrizProbabilidadesK[irisSetosa.length + j][1], pesoExponencial);
                }
                nuevoCentroVersi.push(aux1 / aux2);
            }

            salir = criterioConver(nuevoCentroSetosa, nuevoCentroVersi);
            let newValue = [];
            newValue.push(nuevoCentroSetosa);
            newValue.push(nuevoCentroVersi);
            newValue = basesIni(newValue);
            setCentrosObtenidos(newValue);
            centrosVersi = nuevoCentroVersi;
            centrosSetosa = nuevoCentroSetosa;

            iteracion++;
        }
    }

    const criterioConver = (nuevoCentroSetosa, nuevoCentroVersi) => {
        let i = 0;
        let aux1 = 0;
        while (i < centrosObtenidos.length) {
            aux1 += Math.pow(nuevoCentroSetosa[i] - centrosObtenidos[i], 2);
            i++;
        }
        if (Math.sqrt(aux1) > tolerancia) {
            return false;
        }
        else {
            let j = 0;
            let aux2 = 0;
            while (j < centrosVersi.length) {
                aux2 += Math.pow(nuevoCentroVersi[j] - centrosVersi[j], 2);
                j++;
            }
            if (Math.sqrt(aux2) > tolerancia) {
                return false;
            }
        }
        return true;
    }

    const existExample = () => {
        if(newExample.length !== 0){
            let example = formatResult(newExample);
            resultKmeans(example);
        }
        else alert("Antes tienes que introducir un ejemplo para clasificarlo")
    }

    const resultKmeans = (example) => {
        let resultFinal = "\n";
        let centrosFinal = formatCentersFinal(centrosObtenidos);
        let resultSetosa = 0;
        let resultVersiColor = 0;
        for (let j = 0; j < centrosFinal[0].length; j++) {
            resultSetosa += Math.pow(example[j] -  centrosFinal[0][j], 2);
        }
        for (let j = 0; j < centrosFinal[1].length; j++) {
            resultVersiColor += Math.pow(example[j] -  centrosFinal[1][j], 2);
        }
        if (resultSetosa < resultVersiColor) {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
        }
        else {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
        }
        setResult([...result,  resultFinal]);

    }



    return (
        <div className="main">
            <div className="panelKMeans">
                <div className="data">
                    <label id="datalabel">Datos</label>
                    <br />
                    {items()}
                    <label id="parameterslabel">Parámetros</label>
                    <div className="parameters1">
                        <label id="tolerancialabel">Tolerancia:</label>
                        <input type="text" id="tolerancia" name="tolerancia" size="32" value={tolerancia} onChange={(e)=>setField1(e)}required></input>
                    </div>
                    <div className="parameters2">
                        <label id="pesoExpolabel">Peso exponencial:</label>
                        <input type="text" id="pesoExponencial" name="pesoExponencial" size="32" value={pesoExponencial} onChange={(e)=>setField2(e)}required></input>
                    </div>
                    <div className="botonera">
                        <Button variant="outlined" color="warning" onClick={defaultValuesParams}>{'Por defecto'}</Button>
                        <Button variant="outlined" color="warning" onClick={randomValuesParams}>{'Aleatorio'}</Button>
                    </div>
                </div>
                <div className="secondaryPanel">
                    <div className="centros">
                        <div className="centrosIniPanel">
                            <label id="centrosLabel">Centros Iniciales</label>
                            <br />
                            <TextField id="outlined-basic" fullWidth label="Centros iniciales" multiline maxRows={6} value={centrosIniciales} variant="outlined" />
                            <div className="botonera">
                                <Button variant="outlined" color="warning" onClick={defaultValuesBases}>{'Por defecto'}</Button>
                                <Button variant="outlined" color="warning" onClick={randomValuesBases}>{'Aleatorio'}</Button>
                            </div>
                        </div>
                        <div className="centrosObtPanel">
                            <label id="centrosObLabel">Centros Obtenidos</label>
                            <br />
                            <TextField id="outlined-basic" fullWidth label="Centros obtenidos" multiline maxRows={6} value={centrosObtenidos} variant="outlined" />
                            <div className="botonera">
                                <Button variant="outlined" onClick={execute_kmeans}>{'Ejecutar Algoritmo'}</Button>
                            </div>
                        </div>
                    </div>
                    <div className="organice">
                        <label id="newExampleLabel">Clasificar Nuevos Ejemplos</label>
                        <div className="examplesPanel">
                            <div className="addExample">
                                <TextField id="outlined-basic" fullWidth label="Nuevos ejemplos" multiline maxRows={6} value={allExamples} variant="outlined" />
                                <div className="botonera">
                                    <form onSubmit={handleSubmit}>
                                        <TextField label="Ejemplo" color="success" id="example" name="example" variant="standard" size={50} required />
                                        <Button variant="outlined" color="success" type="submit">{'+ ejemplo'}</Button>
                                    </form>
                                </div>
                            </div>
                            <div className="clasificarExample">
                                <TextField id="outlined-basic" fullWidth label="Nuevos Ejemplos clasificados" multiline maxRows={6} value={result} variant="outlined" />
                                <div className="botonera">
                                    <Button variant="outlined" onClick={existExample}>{'Clasificar ejemplo'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
