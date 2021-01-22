//VAI BUSCAR O FORMULARIO DA PRIMEIRA PAGINA(CARACTERIZACAO)
function get_form1(){
    let d = new Date();
    let xml = "<Questionario>";

    let idade = document.forms["fdpessoais"]["idade"].value;
    xml += '<q id="q1">'+idade+'</q>';

    let sexo = document.forms["fdpessoais"]["sexo"].value;
    xml += '<q id="q2">'+sexo+'</q>';

    let frequencia = document.forms["fdpessoais"]["frequencia"].value;
    xml += '<q id="q3">'+frequencia+'</q>';

    let p1 = document.forms["fdpessoais"]["first"].value;
    xml += '<q id="q4">'+p1+'</q>';

    let p2 = document.forms["fdpessoais"]["second"].value;
    xml += '<q id="q5">'+p2+'</q>';

    let p3 = document.forms["fdpessoais"]["third"].value;
    xml += '<q id="q6">'+p3+'</q>';

    let app = document.forms["fdpessoais"]["sim/nao"].value;
    let quais = document.forms["fdpessoais"]["quais"].value;
    xml += '<q id="q7">' + app + '</q>';
    xml += '<q id="q8">' + quais + '</q>';

    window.localStorage.setItem(d.getTime(), xml);
    window.localStorage.setItem("current", d.getTime());
}

function getLastKey(){
    let d = null;
    d = window.localStorage.getItem("current");
    return d;
}

//VAI BUSCAR O FORMULARIO DA SEGUNDA PAGINA(TAREFAS)
function get_form2(){
    let d = getLastKey();

    let xml = window.localStorage.getItem(d);

    let tarefas1 = document.forms["ftarefas"]["tarefa1"].value;

    xml += '<q id="q9">'+tarefas1+ '</q>';

    let tarefas2 = document.forms["ftarefas"]["t2r"].value;

    xml += '<q id="q10">'+tarefas2+ '</q>';

    let tarefas3 = document.forms["ftarefas"]["tarefa3"].value;

    xml += '<q id="q11">'+tarefas3+ '</q>';

    let tarefas4 = document.forms["ftarefas"]["t4r"].value;

    xml += '<q id="q12">'+tarefas4+ '</q>';

    let tarefas5 = document.forms["ftarefas"]["tarefa5"].value;

    xml += '<q id="q13">'+tarefas5+ '</q>';

    let tarefas6 = document.forms["ftarefas"]["t6r"].value;

    xml += '<q id="q14">'+tarefas6+ '</q>';

    let tarefas7 = document.forms["ftarefas"]["t7r"].value;

    xml += '<q id="q15">'+tarefas7+ '</q>';

    let tarefas8 = document.forms["ftarefas"]["tarefa8"].value;

    xml += '<q id="q16">'+tarefas8+ '</q>';

    let tarefas9 = document.forms["ftarefas"]["tarefa9"].value;

    xml += '<q id="q17">'+tarefas9+ '</q>';

    window.localStorage.setItem(d, xml);
}

//VAI BUSCAR O FORMULARIO DA TERCEIRA PAGINA(AV.GLOBAL)
function get_form3(){

    let d = getLastKey();

    let xml = window.localStorage.getItem(d);

    let avaliacao1 = document.forms["fava"]["slider1"].value;

    xml += '<q id="q18">'+avaliacao1+'</q>';

    let avaliacao2 = document.forms["fava"]["slider2"].value;

    xml += '<q id="q19">'+avaliacao2+'</q>';

    let avaliacao3 = document.forms["fava"]["slider3"].value;

    xml += '<q id="q20">'+avaliacao3+'</q>';

    let avaliacao4 = document.forms["fava"]["slider4"].value;

    xml += '<q id="q21">'+avaliacao4+'</q>';

    let avaliacao5 = document.forms["fava"]["a1"].value;

    xml += '<q id="q22">'+avaliacao5+'</q>';

    let avaliacao6 = document.forms["fava"]["a2"].value;

    xml += '<q id="q23">'+avaliacao6+'</q>';

    let avaliacao7 = document.forms["fava"]["a3"].value;

    xml += '<q id="q24">'+avaliacao7+'</q>';

    let avaliacao8 = document.forms["fava"]["a4"].value;

    xml += '<q id="q25">'+avaliacao8+'</q>';

    let avaliacao9 = document.forms["fava"]["a5"].value;

    xml += '<q id="q26">'+avaliacao9+'</q>';

    let avaliacao10 = document.forms["fava"]["a6"].value;

    xml += '<q id="q27">'+avaliacao10+'</q>';

    let avaliacao11 = document.forms["fava"]["a7"].value;

    xml += '<q id="q28">'+avaliacao11+'</q>';

    let avaliacao12 = document.forms["fava"]["a8"].value;

    xml += '<q id="q29">'+avaliacao12+'</q>';

    let avaliacao13 = document.forms["fava"]["a9"].value;

    xml += '<q id="q30">'+avaliacao13+'</q>';

    let avaliacao14 = document.forms["fava"]["a10"].value;

    xml += '<q id="q31">'+avaliacao14+'</q>';

    xml += "</Questionario>";

    window.localStorage.setItem(d, xml);

    window.localStorage.removeItem("current");
}

function get_data_form(){
    let org = 1;

    let id1 = 0;
    let id2 = 0;
    let id3 = 0;
    let id4 = 0;
    let id5 = 0;

    let s1 = 0;
    let s2 = 0;

    let w1 = 0;
    let  w2 = 0;
    let  w3 = 0;
    let  w4 = 0;
    let  w5 = 0;
    let  w6 = 0;

    let d1 = 0;
    let d2 = 0;
    let d3 = 0;
    let d4 = 0;
    let d5 = 0;

    let todo_index = window.localStorage.length;

    for(let i = 0; i < todo_index; i++){
        let localStorageRow = window.localStorage.getItem(window.localStorage.key(i));

        if(window.DOMParser){
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(localStorageRow,"text/xml");
            let x = xmlDoc.getElementsByTagName("q");

            switch(x[0].childNodes[0].nodeValue){
                case "menor18":
                    id1++;
                    break;
                case "18-25":
                    id2++;
                    break;
                case "26-33":
                    id3++;
                    break;
                case "34-40":
                    id4++;
                    break;
                case "maior40":
                    id5++;
                    break;
            }

            if(x[1].childNodes[0].nodeValue == "masculino"){
                s1++;
            }
            else{
                s2++;
            }

            user_response(x,2,"frequencia",i);

            let aux = 3;

            for(let z = 0; z < 3; z++){
                switch(x[aux].childNodes[0].nodeValue){
                    case "Chrome":
                        w1++;
                        break;
                    case "Edge":
                        w2++;
                        break;
                    case "Firefox":
                        w3++;
                        break;
                    case "Internet Explorer":
                        w4++;
                        break;
                    case "Opera":
                        w5++;
                        break;
                    case "Safari":
                        w6++;
                        break;
                }
                aux++;
            }

            user_response(x,6,"outras",i);

            user_response(x,7,"quais",i);
            
            user_response(x,8,"funcionalidades",i);

            user_response(x,9,"class_dif",i);
            
            user_response(x,10,"dificuldades",i);
            
            user_response(x,11,"cor",i);
            
            user_response(x,12,"outras_dif",i);

            user_response(x,13,"img1",i);

            user_response(x,14,"img2",i);

            user_response(x,15,"class_res",i);

            user_response(x,16,"tipo",i);

            user_response(x,17,"a1",i);
            user_response(x,18,"a2",i);
            user_response(x,19,"a3",i);
            user_response(x,20,"a4",i);

            switch( x[21].childNodes[0].nodeValue ) {
                case "1": 
                    d1++;
                    break;
                case "2": 
                    d2++;
                    break;
                case "3": 
                    d3++;
                    break;
                case "4": 
                    d4++;
                    break;
                case "5": 
                    d5++;
                    break;
            }


            user_response(x,22,"l1",i);
            user_response(x,23,"l2",i);
            user_response(x,24,"l3",i);
            user_response(x,25,"l4",i);
            user_response(x,26,"l5",i);
            user_response(x,27,"l6",i);
            user_response(x,28,"l7",i);
            user_response(x,29,"l8",i);
            user_response(x,30,"l9",i);
        }
    }

    sexos = {
        'M': s1,
        'F': s2
    }

    idades = {
        '<18': id1,
        '18-25': id2,
        '26-33': id3,
        '34-40': id4,
        '>40': id5
    }

    sites = {
        'Chrome': w1,
        'Edge': w2,
        'Firefox': w3,
        'InternetExplorer': w4,
        'Opera': w5,
        'Safari': w6
    }

    freqs = {
        '1': d1,
        '2': d2,
        '3': d3,
        '4': d4,
        '5': d5
    }

    grafico(idades,"canvas_idade");
    grafico(sexos,"canvas_sexo");
    grafico(sites,"canvas_web");
    grafico(freqs,"canvas_freq");

}

function grafico(grafval,id) {



    let valor = Object.values(grafval);

    let keys = Object.entries(grafval);

    let values = valor;

    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
 
    var width = 40; 
    var X = 20; 

         
    for (var i =0; i<values.length; i++) {
        ctx.fillStyle = '#ff0000'; 
        var h = values[i];
        ctx.fillRect(X,canvas.height - h,width,h);
             
        X +=  width+15;
        /* text to display Bar number */
        ctx.fillStyle = '#040400';
        ctx.fillText(keys[i][0]+" ("+values[i]+")" ,X-50,canvas.height - h -10);
    }

   
}

function user_response(x, pos, id, user){
    var para = document.createElement("p");

    if(x[pos].childNodes.length > 0){
        var t = document.createTextNode("u"+(user+1)+". "+x[pos].childNodes[0].nodeValue);
    }
    else{
        var t = document.createTextNode("u"+(user+1)+". "+"(Sem resposta)");
    }

    para.appendChild(t);
    document.getElementById(id).appendChild(para);
}

function Write_Text(){
    let x = document.forms["fdpessoais"]["sim/nao"].value;

    if(x == "Não" || x == ""){
        document.forms["fdpessoais"]["quais"].disabled = true;
        document.forms["fdpessoais"]["quais"].value = "";
    }
    else{
        document.forms["fdpessoais"]["quais"].disabled = false;
        document.forms["fdpessoais"]["quais"].required = true;
    }
}

function checkBrowser(elemento){
    let opcao1 = document.getElementById("primeiro");
    let opcao2 = document.getElementById("segundo");
    let opcao3 = document.getElementById("terceiro");

    if((elemento.id.localeCompare("primeiro") !== 0) && (elemento.value == opcao1.value)){
        opcao1.value = "";
    }
    if((elemento.id.localeCompare("segundo") !== 0) && (elemento.value == opcao2.value)){
        opcao2.value = "";
    }
    if((elemento.id.localeCompare("terceiro") !== 0) && (elemento.value == opcao3.value)){
        opcao3.value = "";
    }
}


