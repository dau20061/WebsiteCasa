// ============================================================================
// CASA TEA - PRODUCT IMAGE MIGRATION SCRIPT (SAFE RTDB MIGRATION)
// Chuyển đổi toàn bộ Base64 trong trường image sang URL HTTPS chuẩn Native Endpoint
// Dữ liệu nhị phân Base64 được lưu giữ an toàn trong trường `imageData`
// Không làm mất bất kỳ dữ liệu ảnh nào, không yêu cầu Firebase Storage trả phí
// ============================================================================

import { getProducts, saveProduct } from '../backend/src/services/dbService.js';

const SITE_URL = 'https://www.nguyenlieuphachecasa.com';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function runMigration() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\n==================================================`);
  console.log(`BẮT ĐẦU MIGRATION ẢNH SẢN PHẨM (${isDryRun ? 'DRY-RUN (CHỈ KIỂM TRA)' : 'THỰC THI GHI VÀO RTDB'})`);
  console.log(`==================================================\n`);

  try {
    const products = await getProducts();
    console.log(`Tổng số sản phẩm tìm thấy trong Realtime Database: ${products.length}\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const p of products) {
      const slug = p.slug || (p.name ? slugify(p.name) : p.id);
      const isBase64 = p.image && typeof p.image === 'string' && p.image.startsWith('data:image/');

      if (isBase64) {
        const oldImageLen = p.image.length;
        const targetHttpsUrl = `${SITE_URL}/product-image/${slug}.webp`;

        console.log(`[MIGRATION] Sản phẩm: "${p.name}" (ID: ${p.id})`);
        console.log(`  -> Trạng thái: Phát hiện ảnh Base64 (${Math.round(oldImageLen / 1024)} KB)`);
        console.log(`  -> URL mới: ${targetHttpsUrl}`);

        if (!isDryRun) {
          try {
            const updatedProduct = {
              ...p,
              imageData: p.image, // Lưu giữ dữ liệu nhị phân an toàn để endpoint phục vụ tải ảnh
              image: targetHttpsUrl, // Trường image trở thành URL HTTPS tuyệt đối chuẩn SEO
              images: [targetHttpsUrl]
            };

            await saveProduct(updatedProduct);
            console.log(`  -> Lưu Database: THÀNH CÔNG (SUCCESS)\n`);
            migratedCount++;
          } catch (err) {
            console.error(`  -> Lưu Database: THẤT BẠI: ${err.message}\n`);
            errorCount++;
          }
        } else {
          console.log(`  -> [DRY RUN] Sẽ lưu imageData và gán image = ${targetHttpsUrl}\n`);
          migratedCount++;
        }
      } else {
        console.log(`[BỎ QUA] "${p.name}": Đã có URL chuẩn: ${p.image?.slice(0, 60)}...\n`);
        skippedCount++;
      }
    }

    console.log(`==================================================`);
    console.log(`KẾT QUẢ MIGRATION:`);
    console.log(`- Đã xử lý chuyển đổi: ${migratedCount} sản phẩm`);
    console.log(`- Đã bỏ qua (đã có HTTPS): ${skippedCount} sản phẩm`);
    console.log(`- Lỗi: ${errorCount}`);
    console.log(`==================================================\n`);

    process.exit(0);
  } catch (err) {
    console.error('[Migration Fatal Error]:', err);
    process.exit(1);
  }
}

runMigration();
