import connectDB from '../lib/db';
import { BuyProperty } from '../models/BuyProperty';
import { CommercialProperty } from '../models/CommercialProperty';
import { OffPlanProperty } from '../models/OffPlanProperty';

async function updateImagePaths(model: any, modelName: string, imageField: string = 'images') {
  const properties = await model.find();
  let updatedCount = 0;
  for (const property of properties) {
    let changed = false;
    const images = property[imageField] || [];
    const newImages = images.map((url: string) => {
      if (url && url.startsWith('/uploads/property/')) {
        changed = true;
        const newUrl = url.replace('/uploads/property/', '/uploads/');
        console.log(`[${modelName}] Property ID: ${property._id} - Updated: ${url} -> ${newUrl}`);
        return newUrl;
      }
      return url;
    });
    if (changed) {
      property[imageField] = newImages;
      await property.save();
      updatedCount++;
    }
  }
  console.log(`[${modelName}] Updated ${updatedCount} properties with new image paths.`);
}

async function main() {
  await connectDB();
  await updateImagePaths(BuyProperty, 'BuyProperty');
  await updateImagePaths(CommercialProperty, 'CommercialProperty');
  await updateImagePaths(OffPlanProperty, 'OffPlanProperty');
  console.log('Done updating image paths.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running update-image-paths:', err);
  process.exit(1);
}); 