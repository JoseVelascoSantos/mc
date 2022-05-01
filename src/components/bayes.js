import React, {useContext, useState} from "react";
import "../styles/bayes.css"
import {DataTraining} from './dataTraining';
import {basesIni, formatMatrix, formatResult} from "../javascripts/formatData"
import * as math from "mathjs"
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Bayes() {
    let irisSetosa = [];
    let irisVersicolor = [];
    const d = 4;

    const {data} = useContext(DataTraining);
    const [centrosObtenidos, setCentrosObtenidos] = useState([]);
    const [matrixCov, setMatrixCov] = useState([]);
    const [matrixCovSetosa, setMatrixCovSetosa] = useState([]);
    const [matrixCovVersicolor, setMatrixCovVersicolor] = useState([]);
    const [mediaSetosa, setMediaSetosa] = useState([]);
    const [mediaVersiColor, setMediaVersiColor] = useState([]);
    const [newExample, setNewExample] = useState([]);
    const [allExamples, setAllExamples] = useState([]);
    const [result, setResult] = useState([]);

    const items = () =>{
        let array = [];
        for(let item in data){
            let formatData = data[item].values;
            formatData = formatData.map((element, index) => {
                if (index === 0) return element.toString();
                else return "\n".concat(element.toString());
            });
            array.push(
                <TextField id="outlined-basic" fullWidth label={item} multiline maxRows={6} value={formatData} variant="outlined" />,
                <br />,
            )
        }
        return array
    }

    const matrix = () =>{
        let array = [];
        for(let item in data){
            debugger
            let formatData = data[item].values;
            formatData = formatData.map(element => {
                return "\n".concat(element.toString());
            });
            array.push(
                <TextField id="outlined-basic" label={item} multiline maxRows={6} value={matrixCov[item]} variant="outlined" />,
                <br />,
                );
        }
        return array;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewExample(e.target[0].value);
        setAllExamples([...allExamples, "\n" + (allExamples.length+1) + ") " +e.target[0].value])
    }

    const bayes = () => {
        debugger
        irisSetosa = data["Iris-setosa"]["values"];
        irisVersicolor = data["Iris-versicolor"]["values"];
        for (let i = 0; i < irisSetosa[0].length; i++) {
            let auxSetosa = 0;
            let auxVersiColor = 0;
            for (let j = 0; j < irisSetosa.length; j++) {
                auxSetosa += parseFloat(irisSetosa[j][i]);
                auxVersiColor += parseFloat(irisVersicolor[j][i]);
            }
            mediaSetosa.push(auxSetosa * (1 / irisSetosa.length));
            mediaVersiColor.push(auxVersiColor * (1 / irisVersicolor.length));
        }

        let array = [];
        array.push(mediaSetosa);
        array.push(mediaVersiColor);
        array = basesIni(array);
        setCentrosObtenidos(array);

        let cov1 = covarianceMatrix(mediaSetosa,1);
        let cov2 = covarianceMatrix(mediaVersiColor,2);

        setMatrixCovSetosa(cov1);
        setMatrixCovVersicolor(cov2);
        cov1 = formatMatrix(cov1._data);
        cov2 = formatMatrix(cov2._data);

        let matrixCov = {
            "Iris-setosa" : cov1,
            "Iris-versicolor" : cov2
        }
        setMatrixCov(matrixCov);

    }
    const existExample = () => {
        if(newExample.length !== 0){
            let example = formatResult(newExample);
            resultBayes(example);
        }
        else alert("Antes tienes que introducir un ejemplo para clasificarlo")
    }
    const resultBayes = (example) => {
        let inv = math.inv(matrixCovSetosa);
        let deductXkm1 = [example[0]-mediaSetosa[0],example[1]-mediaSetosa[1], example[2]-mediaSetosa[2], example[3]-mediaSetosa[3]];
        let transp = math.transpose(deductXkm1);
        let aux = math.multiply(-1/2,transp);
        let mult = math.multiply(aux,inv);
        let resol = math.multiply(mult,deductXkm1);

        let inv2 = math.inv(matrixCovVersicolor);
        let deductXkm2 = [example[0]-mediaVersiColor[0],example[1]-mediaVersiColor[1], example[2]-mediaVersiColor[2], example[3]-mediaVersiColor[3]];
        let transp2 = math.transpose(deductXkm2);
        let aux2 = math.multiply(-1/2,transp2);
        let mult2 = math.multiply(aux2,inv2);
        let resol2 = math.multiply(mult2,deductXkm2);

        let exp = Math.exp(resol);
        let part1 =  1 /  ( Math.pow((2*Math.PI),d/2) * (Math.pow(math.det(matrixCovSetosa),1/2)) );
        let fxiw = part1 * exp;

        let exp2 = Math.exp(resol2);
        let fxiw2 = 1 /  ( Math.pow((2*Math.PI),d/2) * (Math.pow(math.det(matrixCovVersicolor),1/2)) ) * exp2;
        let resultFinal = "\n";
        if(fxiw > fxiw2){
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-setosa");
        }
        else {
            resultFinal = (resultFinal + allExamples.length).concat(") Iris-versicolor");
        }
        setResult([...result,  resultFinal]);
    }

    const covarianceMatrix = (m,classs) => {
        let size;
        let ini = 0;
        let matrix = math.matrix([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
        let array;
        let long;
        if(classs === 1){
            long = data["Iris-setosa"].values.length;
            size = data["Iris-setosa"].values.length;
            array = data["Iris-setosa"].values;
        }
        else{
            long = data["Iris-versicolor"].values.length;
            size = data["Iris-versicolor"].values.length;
            array = data["Iris-versicolor"].values;
        }
        for(let i = ini; i < size; i++){
            const sample = array[i];
            let sample2 = math.matrix([[Number(sample[0]),Number(sample[1]),Number(sample[2]),Number(sample[3])]]);
            let m2 = math.matrix([[m[0],m[1],m[2],m[3]]]);
            let subtract = math.subtract(sample2,m2);
            let transp = math.transpose(subtract);
            let multiply = math.multiply(transp,subtract);
            matrix = math.add(matrix,multiply);
        }
        return math.divide(matrix, long);
    };

    return (
        <div className="main">
            <div className="panelBayes">
                <div className="panel1">
                    <div className="matrix">
                        <label id="matrixLabel">Matrices de Covarianza</label>
                        <br />
                        <div className="matrixData">
                            {matrix()}
                        </div>
                        <div className="botoneraBayes">
                            <Button variant="outlined" onClick={bayes}>{'Ejecutar Algoritmo'}</Button>
                        </div>
                    </div>
                    <div className="centrosObtPanelBayes">
                        <label id="centrosObLabel">Centros Obtenidos</label>
                        <br />
                        <TextField id="outlined-basic" fullWidth label="Centros Obtenidos" multiline maxRows={6} value={centrosObtenidos} variant="outlined" />
                    </div>
                </div>
                <div className="panel2">
                    <div className="data">
                        <br />
                        <label id="datalabel">Datos</label>
                        <br />
                        {items()}
                    </div>
                    <div className="organiceBayes">
                        <label id="newExampleLabel">Clasificar Nuevos Ejemplos</label>
                        <div className="examplesPanel">
                            <div className="addExample">
                                <TextField id="outlined-basic" label="Nuevos ejemplos" multiline maxRows={6} value={allExamples} variant="outlined" />
                                <div className="botonera">
                                    <form onSubmit={handleSubmit}>
                                        <TextField label="Ejemplo" color="success" id="name" name="name" variant="standard" size={50} required />
                                        <Button variant="outlined" color="success" type="submit">{'+ ejemplo'}</Button>
                                    </form>
                                </div>
                            </div>
                            <div className="clasificarExample">
                                <TextField id="outlined-basic" label="Nuevos ejemplos clasificados" multiline maxRows={6} value={result} variant="outlined" />
                                <div className="botonera">
                                    <Button variant="outlined" onClick={existExample}>{'Clasificar Ejemplo'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
