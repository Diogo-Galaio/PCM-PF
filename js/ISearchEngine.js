'use strict';

class ISearchEngine {
    constructor(dbase) {
         //Pool to include all the objects (mainly pictures) drawn in canvas 
        this.allpictures = new Pool(3000);

        //Array of color to be used in image processing algorithms
        this.colors = ["red", "orange", "yellow", "green", "Blue-green", "blue", "purple", "pink", "white", "grey", "black", "brown"];

        // Red component of each color
        this.redColor = [204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136];
        // Green component of each color
        this.greenColor = [0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84];
        // Blue component of each color
        this.blueColor = [0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24];

        //List of categories available in the image database
        this.categories = ["beach", "birthday", "face", "indoor", "manmade/artificial", "manmade/manmade", "manmade/urban", "marriage", "nature", "no_people", "outdoor", "party", "people", "snow"];

        //Name of the XML file with the information related to the images 
        this.XML_file = dbase;
 
        // Instance of the XML_Database class to manage the information in the XML file 
        this.XML_db = new XML_Database();

        // Instance of the LocalStorageXML class to manage the information in the LocalStorage 
        this.LS_db = new LocalStorageXML();

        //Number of images per category for image processing
        this.num_Images = 80;
        //Number of images to show in canvas as a search result
        this.numshownpic = 30;

        //Width of image in canvas
        this.imgWidth = 190;
        //Height of image in canvas
        this.imgHeight = 140;

    }

    //Method to initialize the canvas. First stage it is used to process all the images
    init(cnv) {
        this.gridView(cnv);
        //document.getElementById("search").value=window.localStorage.getItem("category");
        //this.databaseProcessing(cnv);
    }

   databaseProcessing(cnv) {

       let h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
       let colmoments = new ColorMoments();

       let pics = [];
       for(let i=0;i<this.categories.length;i++){
           let imgs = this.searchKeywords(this.categories[i]);
           for(let j=0;j<imgs.length;j++){
               let img = new Picture(0, 0, 200, 200,imgs[j], this.categories[i]);
               pics.push(img);
           }
       }

       for(let i=0; i<pics.length; i++){
           let eventname = "processed_picture_" + pics[i].impath;
           let eventP = new Event(eventname);
           let self = this;
           document.addEventListener(eventname, function(){
               self.imageProcessed(pics[i], eventname);
           },false);

           pics[i].computation(cnv, h12color, colmoments, eventP);
       }
    }

    //When the event "processed_picture_" is enabled this method is called to check if all the images are
    //already processed. When all the images are processed, a database organized in XML is saved in the localStorage
    //to answer the queries related to Color and Image Example
    imageProcessed(img, eventname) {
        console.log(img.hist);
        this.allpictures.insert(img);
        console.log("image processed " + this.allpictures.stuff.length + eventname);
        if (this.allpictures.stuff.length === (this.num_Images * this.categories.length)) {
            this.createXMLColordatabaseLS();
            //this.createXMLIExampledatabaseLS();
        }
    }

    //Method to create the XML database in the localStorage for color queries
    createXMLColordatabaseLS() {
        //criamos uma tag de imagens para cada categoria pelo for
        for(let x=0;x<this.categories.length;x++){
            let xmlRow = "<images>";
            for(let i=0;i<this.colors.length;i++) {
                let imgs = [];
                for (let j = 0; j < this.allpictures.stuff.length; j++) {
                    if (this.allpictures.stuff[j].category === this.categories[x]) {
                        imgs.push(this.allpictures.stuff[j]);
                    }
                }

                this.sortbyColor(i,imgs);

                for (let j = 0; j < 30; j++) {
                    xmlRow += '<image class="'+this.colors[i]+'">\n'+"<path>" + imgs[j].impath + "</path>\n"+
                        '</image>\n';
                }
            }
            xmlRow += "</images>";
            this.LS_db.saveLS_XML(this.categories[x], xmlRow);
        }
        console.log(this.searchColor("snow","blue"));
    }

    //Method to create the XML database in the localStorage for Image Example queries
    createXMLIExampledatabaseLS() {
        let list_images = new Pool(this.allpictures.stuff.length);
        this.zscoreNormalization();

    }

    //A good normalization of the data is very important to look for similar images. This method applies the
    // zscore normalization to the data
    zscoreNormalization() {
        let overall_mean = [];
        let overall_std = [];

        // Inicialization
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean.push(0);
            overall_std.push(0);
        }

        // Mean computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_mean[j] += this.allpictures.stuff[i].color_moments[j];
            }
        }

        // Mean computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean[i] /= this.allpictures.stuff.length;
        }

        // STD computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_std[j] += Math.pow((this.allpictures.stuff[i].color_moments[j] - overall_mean[j]), 2);
            }
        }

        // STD computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_std[i] = Math.sqrt(overall_std[i] / this.allpictures.stuff.length);
        }

        // zscore normalization
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                this.allpictures.stuff[i].color_moments[j] = (this.allpictures.stuff[i].color_moments[j] - overall_mean[j]) / overall_std[j];
            }
        }
    }

    //Method to search images based on a selected color
    searchColor(category, color) {
        const xmlDoc = this.LS_db.readLS_XML(category);
        const xmlByColor = xmlDoc.getElementsByClassName(color);
        let pathArray=[];
        for(let i=0;i<xmlByColor.length;i++){
            pathArray.push(xmlByColor[i].getElementsByTagName("path")[0].childNodes[0].nodeValue);
        }
        return pathArray;
    }

    //Method to search images based on keywords
    searchKeywords(category) {
        //console.log(this.XML_db.SearchXML(category,this.XML_db.loadXMLfile(this.XML_file),this.num_Images);)
        return this.XML_db.SearchXML(category,this.XML_db.loadXMLfile(this.XML_file),this.num_Images);
    }

    //Method to search images based on Image similarities
    searchISimilarity(IExample, dist) {

        // this method should be completed by the students

    }

    //Method to compute the Manhattan difference between 2 images which is one way of measure the similarity
    //between images.
    calcManhattanDist(img1, img2) {
        let manhattan = 0;

        for (let i = 0; i < img1.color_moments.length; i++) {
            manhattan += Math.abs(img1.color_moments[i] - img2.color_moments[i]);
        }
        manhattan /= img1.color_moments.length;
        return manhattan;
    }

    //Method to sort images according to the Manhattan distance measure
    sortbyManhattanDist(idxdist,list){
        list.sort(function (a, b) {
            return b.color_moments[idxdist] - a.color_moments[idxdist];
        });
        // this method should be completed by the students
    }

    //Method to sort images according to the number of pixels of a selected color
    sortbyColor(idxColor, list) {
        list.sort(function(a, b) {
            return b.hist[idxColor] - a.hist[idxColor];
        });
    }

    //Method to visualize images in canvas organized in columns and rows
    gridView (canvas) {
        let category = window.localStorage.getItem("category");
        let color = window.localStorage.getItem("colorsearch");
        let imgArray = [];

        for(let i=0;i<this.categories.length;i++){
            if(category==="no_people"){
                if(color===null) imgArray=this.searchKeywords(category);
                else imgArray=this.searchColor(category,color);
            }
            else if(category==="people"){
                if(color === null) arrayImgs = this.searchKeywords("people");
                else arrayImgs = this.searchColor("people", color);
            }
            else if(category.includes(this.categories[i])){
                if(color===null) imgArray=imgArray.concat(this.searchKeywords(this.categories[i]));
                else imgArray=imgArray.concat(this.searchColor(this.categories[i],color));
            }
        }

        if(imgArray.length===0){
            canvas.height = 35;
            let ctx = canvas.getContext("2d");
            ctx.font = "20px Arial";
            let text="Category not found, please try one of the above";
            ctx.fillText(text, 10, 25);
        }else{

            let canvasSize = 10;
            const linhas = imgArray.length / 5;
            for (let i = 0; i < linhas; i++) {
                canvasSize += 210;
            }
            canvas.height = canvasSize;

            let x = 30;
            let y = 10;
            for (let i = 0; i < imgArray.length; i++) {
                let img = new Picture(x, y, 200, 200, imgArray[i], category);
                img.draw(canvas);
                x += 210;
                if (x === 1080) {
                    x = 30;
                    y += 210;
                }
            }
        }
    }

}


class Pool {
    constructor(maxSize) {
        this.size = maxSize;
        this.stuff = [];

    }

    insert(obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove() {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            alert("There aren't objects in the application to delete");
        }
    }

    empty_Pool() {
        while (this.stuff.length > 0) {
            this.remove();
        }
    }
}