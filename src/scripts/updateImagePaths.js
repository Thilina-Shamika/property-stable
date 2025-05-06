const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function updateImagePaths() {
  try {
    await client.connect();
    const db = client.db('your_database_name'); // Replace with your actual database name
    const collections = ['buy', 'rent', 'commercial']; // Add all collections that store image paths

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      for (const doc of documents) {
        if (doc.images && Array.isArray(doc.images)) {
          const updatedImages = doc.images.map(img => img.replace('/uploads/property/', '/uploads/'));
          await collection.updateOne(
            { _id: doc._id },
            { $set: { images: updatedImages } }
          );
        }
      }
    }

    console.log('Image paths updated successfully.');
  } catch (error) {
    console.error('Error updating image paths:', error);
  } finally {
    await client.close();
  }
}

updateImagePaths(); 