import React, {useContext, useState} from "react";
import "../styles/lloyd.css"
import {DataTraining} from './dataTraining';
import {basesIni, formatResult, roundDecimals} from "../javascripts/formatData"
import * as math from "mathjs"
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


export default function Lloyd() {
    let basesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let OldbasesIniciales = {
        0: [4.6,3.0,4.0,0.0],
        1: [6.8,3.4,4.6,0.7]
    };
    let defaultTolerancia = Math.pow(10, -10);
    let defaultPesoExponencial = 2;
    let numMaxIter = 10;
    let rLearn = 0.1;
    let b = 2;



    const {data} = useContext(DataTraining);
    const [tolerancia, setTolerancia] = useState(defaultTolerancia);
    const [pesoExponencial, setPesoExponencial] = useState(defaultPesoExponencial);
    const [centrosIniciales, setCentrosIniciales] = useState(basesIni(basesIniciales));
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);
    const [centrosObtenidosNofix, setcentrosObtenidosNofix] = useState([]);
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
                <br />
            )
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
        debugger
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

    const existExample = () => {
        debugger
        if(newExample.length !== 0){
            let example = formatResult(newExample);
            resultLloyd(example);
        }
        else alert("Antes tienes que introducir un ejemplo para clasificarlo")
    }

    const calculateDLloyd = (centers, i, sample) => {
        let dij = 0;
        let centroid = centers[i];
        let base = sample[0] - centroid[0];
        dij += Math.pow(base, b);
        base = sample[1] - centroid[1];
        dij += Math.pow(base, b);
        base = sample[2] - centroid[2];
        dij += Math.pow(base, b);
        base = sample[3] - centroid[3];
        dij += Math.pow(base, b);
        return Math.sqrt(dij);
    };

    const resultLloyd = (example) => {
        let Pvixj1 = 0;
        let Pvixj2 = 0;
        let dij1 = calculateDLloyd(centrosObtenidosNofix, 0,example);
        let dij2 = calculateDLloyd(centrosObtenidosNofix, 1,example);
        let num1 = (1 / dij1);
        let num2 = (1 / dij2);
        let den = num1 + num2;
        Pvixj1 = num1 / den;
        Pvixj2 = num2 / den;
        let resultFinal = "\n";
        if(Pvixj1 > Pvixj2){
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
        }
        else {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
        }
        setResult([...result,  resultFinal]);
    };

    const lloyd = () => {
        let stop = false;
        let it = 1;
        let v1euc;
        let v2euc;
        while(!stop && it <= numMaxIter){
            updateLloydCentroids();
            v1euc = math.subtract(basesIniciales[0],OldbasesIniciales[0]);
            v2euc =  math.subtract(basesIniciales[1],OldbasesIniciales[1]);

            if( v1euc < defaultTolerancia && v2euc < defaultTolerancia)
                stop = true;
            it++;
        }
        let newValue = [];
        debugger
        newValue.push(basesIniciales[0]);
        newValue.push(basesIniciales[1]);
        setcentrosObtenidosNofix(newValue);
        newValue = basesIni(newValue);
        setCentrosObtenidos(newValue);
    }
    const updateLloydCentroids = () => {
        for(let element in data){
            for (let j = 0; j < data[element].values.length; j++) {
                let v1 = basesIniciales[0];
                let v2 = basesIniciales[1];
                const sample = data[element].values[j];
                let sampleMatrix = math.matrix([[Number(sample[0])],[Number(sample[1])],[Number(sample[2])],[Number(sample[3])]]);

                let d1 = calculateDLloyd(basesIniciales, 0,sample);
                let d2 = calculateDLloyd(basesIniciales, 1,sample);

                if(d1 < d2){
                    let sol = 0;
                    let c1 = math.matrix([[v1[0]],[v1[1]],[v1[2]],[v1[3]]]);
                    let subtractAndkMultiply = math.multiply(math.subtract(sampleMatrix,c1),rLearn);
                    sol = math.add(c1,subtractAndkMultiply);
                    basesIniciales[0] = [sol.get([0, 0]),sol.get([1, 0]),sol.get([2, 0]),sol.get([3, 0])];
                }
                else{
                    let sol2 = 0;
                    let c2 = math.matrix([[v2[0]],[v2[1]],[v2[2]],[v2[3]]]);
                    let subtractAndkMultiply = math.multiply(math.subtract(sampleMatrix,c2),rLearn);
                    sol2 = math.add(c2,subtractAndkMultiply);
                    basesIniciales[1] = [sol2.get([0, 0]),sol2.get([1, 0]),sol2.get([2, 0]),sol2.get([3, 0])];
                }
            }
        }
    };


    return (
        <div className="main">
            <div className="panelLloyd">
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
                        <input type="text" id="pesoExponencial" name="pesoExponencial" size="32" value={pesoExponencial}  onChange={(e)=>setField2(e)}required></input>
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
                                <Button variant="outlined" onClick={lloyd}>{'Ejecutar algoritmo'}</Button>
                            </div>
                        </div>
                    </div>
                    <div className="organice">
                        <label id="newExampleLabel">Clasificar Nuevos Ejemplos</label>
                        <div className="examplesPanel">
                            <div className="addExample">
                                <TextField id="outlined-basic" fullWidth label="Nuevos ejemplos" multiline maxRows={6} value={allExamples} variant="outlined" />
                                <form onSubmit={handleSubmit}>
                                    <TextField label="Ejemplo" color="success" id="example" name="example" variant="standard" size={50} required />
                                    <Button variant="outlined" color="success" type="submit">{'+ ejemplo'}</Button>
                                </form>
                            </div>
                            <div className="clasificarExample">
                                <TextField id="outlined-basic" fullWidth label="Nuevos ejemplos clasificados" multiline maxRows={6} value={result} variant="outlined" />
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
