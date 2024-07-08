import fs from "fs";
import { v4 as uuid } from "uuid";

const path= "./src/managers/data/products.json";

let products = []; // inicializo array vacio para despues leer aca nuestros procuctos

// funcion para crear un producto dentro del array product[]
const addProduct = async (product) =>{    // esta funcion asincrona va a recibir el producto
    try{
        await getProducts();
        const { title, description, price, thumbnail, code, stock, category } = product; //desestructuro el product que voy a recibir. estos datos son los que tiene q recibir el producto

      // creo un nuevo producto que va a ser un objeto  
    const newProduct = {
        id:  products.length + 1,       // uuid():  id autoincremental y unico
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status: true
      };
      //pusheo prducts(let) para agregar el nuevo producto en el array[] 
      products.push(newProduct);
      //guardamos el array de productos en un archivo (json.stringify es xq json no lee el formato js)
      await fs.promises.writeFile(path, JSON.stringify(products));
      return newProduct;

    }catch(error){
        console.log(`${error}`);
    };
};

// para leer el archivo donde estan guardados los productos del array hacemos una funcion asincrona

const getProducts= async()=>{
    try{
        const fileJson= await fs.promises.readFile(path, "utf-8");// lee el archivo donde esta los productos del array
       
        const parseFile = JSON.parse(fileJson); // parse es la inversa de strigify. Lo vuelve a trasformar en codigo js
        products = parseFile || [];// le asigna a la variable products el array de los productos que tenemos en el archivo json

        
        return products;
       
    }catch(error){
        console.log(`${error}`);
    }
}

// leer un producto por id

const getProductById = async(id)=>{
    try{

        await getProducts(); // traemos la funcion donde me lee el array ya parseado y seteado dentro de let products[] ya actualizado

        const product = products.find(p => p.id === id);// buscamos el id dentro del array products
        return product; //retorna el producto encontrado

    }catch(error){
        console.log(`${error}`);
    }
};

// Actualizar un producto

const updateProduct  = async(id, productData)=>{ //en esta funcion se busca que id y que data voy a actualizar 
    try{

        await getProducts(); // la llamamos para trabajar con la ultima actualizacion q tiene el json

        const index = products.findIndex(p => p.id === id);// me devuelve la posicion del producto y cuando lo actualizo queda en la misma posicion
        products[index] = {
            ...products[index],// copio todo lo que tiene el array
            ...productData // sobre la copia de products[index] modifico lo que venga de producData, o sea que lo que venga de productData va a sobreescribir lo que viene de products[index]  
        };

        await fs.promises.writeFile(path, JSON.stringify(products)); // lo actualizamos
        return products[index];

    }catch(error){
        console.log(`${error}`);
    }
};

// eliminar un producto

const deleteProduct = async(id)=>{
    try{

        await getProducts(); // la llamamos para trabajar con la ultima actualizacion q tiene el json

       products = products.filter(p => p.id !== id);// busco todos los procuctos que no cincidan con el id
       await fs.promises.writeFile(path, JSON.stringify(products)); // actualizado con los nuevos productos del json
        return products; 

    }catch(error){
        console.log(`${error}`);
    }
};



export default{
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};