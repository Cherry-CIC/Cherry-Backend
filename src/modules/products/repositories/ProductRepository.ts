import { firestore } from '../../../shared/config/firebaseConfig';
import { Product } from "../model/Product";
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

export class ProductRepository {
    private db = firestore;
    private collectionName = 'products';

    async getAll(): Promise<Product[]> {
        const snapshot = await this.db.collection(this.collectionName).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            } as Product;
        });
    }

    async getById(id: string): Promise<Product | null> {
        const doc = await this.db.collection(this.collectionName).doc(id).get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data()!;
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Product;
    }

    async create(product: Product): Promise<Product> {
        const docRef = await this.db.collection(this.collectionName).add({
            ...product,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        return {
            id: docRef.id,
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    async update(id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product | null> {
        const docRef = this.db.collection(this.collectionName).doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return null;
        }

        await docRef.update({
            ...product,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return this.getById(id);
    }

    async delete(id: string): Promise<boolean> {
        const docRef = this.db.collection(this.collectionName).doc(id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return false;
        }

        await docRef.delete();
        return true;
    }

    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        const snapshot = await this.db
            .collection(this.collectionName)
            .where('categoryId', '==', categoryId)
            .get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            } as Product;
        });
    }

    async getByUserId(userId: string): Promise<Product[]> {
        const snapshot = await this.db
            .collection(this.collectionName)
            .where('userId', '==', userId)
            .get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            } as Product;
        });
    }

    async getProductsByCharity(charityId: string): Promise<Product[]> {
        const snapshot = await this.db
            .collection(this.collectionName)
            .where('charityId', '==', charityId)
            .get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            } as Product;
        });
    }
}
