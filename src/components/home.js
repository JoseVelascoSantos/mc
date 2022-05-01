import React, {useState, useRef} from "react";
import {DataTraining} from './dataTraining';
import Button from '@mui/material/Button';

export default function Home(props) {

    const refData = useRef();

    const {setData} = React.useContext(DataTraining);
    const [file, setFile] = useState([]);

    const handleSubmitData = async (e) => {
        e.preventDefault();
        let file = refData.current.files[0];
        if (file.type === 'text/plain') {
            setFile(file);
            await getFileContentsData(file);
            props.onLoad();
        } else {
            alert('No se trata de un txt');
        }
    }

    async function getFileContentsData(file) {
        const reader = new FileReader();
        reader.readAsText(file);
        const arrayresult = await new Promise((resolve, reject) => {
            reader.onload = function(event) {
                resolve(reader.result)
            }
        })
        transformData(arrayresult)
    }

    const transformData  = (arrayresult) => {
        const lines = arrayresult.split("\n").filter(Boolean);
        const array = {};
        const object = lines.map(line => {
            var array = line.toString().split(",");
            array = array.toString().split("\r");
            return array.filter(element => element);
        });
        for (let str of object) {
            let title = str[0].split(',');
            array[title[title.length - 1]] = {
                values: []
            }
        }
        for (let str of object) {
            let temp = [];
            let numbers = str[0].split(',');
            for (let i = 0; i < numbers.length - 1; ++i) {
                temp.push(numbers[i] );
            }
            array[numbers[numbers.length - 1]].values.push(temp)
        }
        setData(array);
    }

    return (
        <div className="d-flex justify-content-center">
            <Button component="label" variant="contained">
                {'Cargar archivo de entrenamiento'}
                <input type="file" hidden size="32" ref={refData} onChange={handleSubmitData} />
            </Button>
        </div>
    );

}
