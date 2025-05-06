import connectDB from '../lib/db';
import { BuyProperty } from '../models/BuyProperty';
import { OffPlanProperty } from '../models/OffPlanProperty';
import { CommercialProperty } from '../models/CommercialProperty';
import fs from 'fs';
import path from 'path';

async function fileExists(filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(filepath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
}

async function checkImages(model: any, modelName: string, imageField: string = 'images') {
  const missing: { propertyId: string; imageUrl: string }[] = [];
  const properties = await model.find({}).lean();
  for (const property of properties) {
    const images: string[] = property[imageField] || [];
    for (const imageUrl of images) {
      if (!imageUrl.startsWith('/uploads/')) continue;
      const relPath = imageUrl.replace(/^\//, '');
      const absPath = path.join(process.cwd(), 'public', relPath);
      const exists = await fileExists(absPath);
      if (!exists) {
        missing.push({ propertyId: property._id?.toString?.() || '', imageUrl });
      }
    }
  }
  return missing;
}

(async () => {
  await connectDB();
  const missingBuy = await checkImages(BuyProperty, 'BuyProperty');
  const missingOffPlan = await checkImages(OffPlanProperty, 'OffPlanProperty');
  const missingCommercial = await checkImages(CommercialProperty, 'CommercialProperty');

  const allMissing = [
    ...missingBuy.map(m => ({ ...m, type: 'BuyProperty' })),
    ...missingOffPlan.map(m => ({ ...m, type: 'OffPlanProperty' })),
    ...missingCommercial.map(m => ({ ...m, type: 'CommercialProperty' })),
  ];

  if (allMissing.length === 0) {
    console.log('No missing images found!');
  } else {
    console.log('Missing images:');
    allMissing.forEach(({ type, propertyId, imageUrl }) => {
      console.log(`[${type}] Property ID: ${propertyId} - Missing Image: ${imageUrl}`);
    });
  }
  process.exit(0);
})(); 