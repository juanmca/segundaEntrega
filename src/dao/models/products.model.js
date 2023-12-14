import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';



const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number,
    category: String,
    status: {
        type: Boolean,
        default: true,
    },
});

mongoosePaginate.paginate.options = {
    page: 1,
    limit: 10,
    customLabels: {
        totalDocs: 'totalItems',
        docs: 'payload',
        page: 'page',
        nextPage: 'nextPage',
        prevPage: 'prevPage',
        totalPages: 'totalPages',
        hasPrevPage: 'hasPrevPage',
        hasNextPage: 'hasNextPage',
        prevLink: 'prevLink',
        nextLink: 'nextLink',
    },
};

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('products', productSchema);

class ProductManager {
    async addProductRawJSON(productData) {
        try {
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                return "Ya existe un producto con ese código. No se agregó nada.";
            }

            const newProduct = new Product({
                ...productData,
            });

            await newProduct.save();
            return "Producto agregado correctamente.";
        } catch (error) {
            console.error('Error agregando producto:', error.message);
            return "Error agregando producto.";
        }
    }

    async getProducts() {
        try {
            const products = await Product.find({ status: true }).lean();
            return products;
        } catch (error) {
            console.error('Error al leer productos desde MongoDB:', error.message);
            return [];
        }
    }

    async getProductById(pid) {
        try {
            const product = await Product.findOne({ _id: pid });
            return product ? product : undefined;
        } catch (error) {
            console.error('Error al obtener producto por ID desde MongoDB:', error.message);
            return undefined;
        }
    }

    async updateProduct(id, updates) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return { error: "ID de producto no válido.", status: 400 };
            }

            const product = await Product.findOne({ _id: id, status: true });
            if (!product) {
                return { error: "Producto no encontrado o eliminado.", status: 404 };
            }

            for (const key in updates) {
                if (key in product) {
                    product[key] = updates[key];
                }
            }

            await product.save();
            return { message: "Producto actualizado correctamente.", status: 200 };
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const product = await Product.findOne({ _id: pid });
            if (!product) {
                return "Producto no encontrado.";
            }

            product.status = false;
            await product.save();
            console.log(`Producto con ID ${pid} marcado como no disponible.`);

            return "Producto eliminado correctamente.";
        } catch (error) {
            console.error('Error marcando producto como no disponible en MongoDB:', error.message);
            return "Error al marcar el producto como no disponible.";
        }
    }
}

export default ProductManager;