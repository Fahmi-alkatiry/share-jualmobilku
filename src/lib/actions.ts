"use server"
import { writeFile } from 'fs/promises'
import path from 'path'
import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'


export async function createCar(formData: FormData) {
  try {
    // 1. Ambil data teks
    const brand = formData.get("brand") as string
    const model = formData.get("model") as string
    const year = parseInt(formData.get("year") as string)
    const price = parseFloat(formData.get("price") as string)
    const mileage = parseInt(formData.get("mileage") as string)
    const transmission = formData.get("transmission") as "MANUAL" | "AUTOMATIC"
    const color = formData.get("color") as string
    const licensePlate = formData.get("licensePlate") as string
    const taxExpiry = new Date(formData.get("taxExpiry") as string)
    const stnkOwnership = formData.get("stnkOwnership") as string
    const description = formData.get("description") as string

    // 2. Logika Upload FOTO (Multiple)
    const imageFiles = formData.getAll("images") as File[]
    const imagePaths: string[] = []

    for (const file of imageFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-img-${file.name.replace(/\s+/g, '-')}`
        const filePath = path.join(process.cwd(), "public/uploads", fileName)
        await writeFile(filePath, buffer)
        imagePaths.push(`/uploads/${fileName}`)
      }
    }

    // 3. Logika Upload VIDEO (Single MP4)
    const videoFile = formData.get("video") as File
    let videoPath = null

    if (videoFile && videoFile.size > 0) {
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
      const videoName = `${Date.now()}-video-${videoFile.name.replace(/\s+/g, '-')}`
      const videoFullPath = path.join(process.cwd(), "public/uploads", videoName)
      await writeFile(videoFullPath, videoBuffer)
      videoPath = `/uploads/${videoName}`
    }

    // 4. Eksekusi ke Database (Menambahkan field video)
    await prisma.car.create({
      data: {
        brand,
        model,
        year,
        price,
        mileage,
        transmission,
        color,
        licensePlate,
        taxExpiry,
        stnkOwnership,
        description,
        images: imagePaths,
        video: videoPath, // Pastikan field ini masuk ke database
        status: "TERSEDIA"
      }
    })

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Gagal menambah mobil:", error)
    return { success: false }
  }
}

/**
 * Fungsi untuk Menghapus Mobil
 */
export async function deleteCar(id: string) {
  try {
    // 1. Ambil data mobil dulu untuk mendapatkan path gambar & video
    const car = await prisma.car.findUnique({
      where: { id },
      select: { images: true, video: true }
    })

    if (!car) return { success: false, message: "Data tidak ditemukan" }

    // 2. Hapus data dari Database
    await prisma.car.delete({ where: { id } })

    // 3. Hapus File Foto dari folder public/uploads
    for (const imagePath of car.images) {
      const absolutePath = path.join(process.cwd(), "public", imagePath)
      try {
        if (existsSync(absolutePath)) {
          await unlink(absolutePath)
          console.log(`Berhasil menghapus foto: ${imagePath}`)
        }
      } catch (err) {
        console.error(`Gagal menghapus file foto: ${absolutePath}`, err)
      }
    }

    // 4. Hapus File Video dari folder public/uploads
    if (car.video) {
      const absoluteVideoPath = path.join(process.cwd(), "public", car.video)
      try {
        if (existsSync(absoluteVideoPath)) {
          await unlink(absoluteVideoPath)
          console.log(`Berhasil menghapus video: ${car.video}`)
        }
      } catch (err) {
        console.error(`Gagal menghapus file video: ${absoluteVideoPath}`, err)
      }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Gagal menghapus mobil:", error)
    return { success: false }
  }
}

/**
 * Fungsi untuk Mengubah Status (Tersedia <-> Terjual)
 */
export async function toggleStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "TERSEDIA" ? "TERJUAL" : "TERSEDIA"
    await prisma.car.update({
      where: { id },
      data: { status: newStatus as any }
    })
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Gagal update status:", error)
    return { success: false }
  }
}

async function deletePhysicalFile(fileUrl: string | null) {
  if (!fileUrl) return
  
  // Normalisasi path: hapus '/' di awal agar path.join bekerja dengan benar
  const cleanPath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl
  const absolutePath = path.join(process.cwd(), "public", cleanPath)

  try {
    if (existsSync(absolutePath)) {
      await unlink(absolutePath)
      console.log(`✅ File lama dihapus: ${absolutePath}`)
    }
  } catch (err) {
    console.error(`❌ Gagal menghapus file lama: ${absolutePath}`, err)
  }
}

export async function updateCar(id: string, formData: FormData) {
  try {
    // 1. Ambil data mobil yang ada saat ini (Existing Data)
    const existingCar = await prisma.car.findUnique({ where: { id } })
    if (!existingCar) return { success: false, message: "Mobil tidak ditemukan" }

    // 2. Ambil data teks dari form
    const brand = formData.get("brand") as string
    const model = formData.get("model") as string
    const year = parseInt(formData.get("year") as string)
    const price = parseFloat(formData.get("price") as string)
    const mileage = parseInt(formData.get("mileage") as string)
    const transmission = formData.get("transmission") as "MANUAL" | "AUTOMATIC"
    const color = formData.get("color") as string
    const licensePlate = formData.get("licensePlate") as string
    const taxExpiry = new Date(formData.get("taxExpiry") as string)
    const stnkOwnership = formData.get("stnkOwnership") as string
    const description = formData.get("description") as string

    // --- LOGIKA UPDATE FOTO ---
    const imageFiles = formData.getAll("images") as File[]
    let finalImagePaths = existingCar.images

    // Jika ada foto baru yang diunggah (file pertama size > 0)
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      // A. Hapus semua FOTO LAMA dari folder public
      for (const oldPath of existingCar.images) {
        await deletePhysicalFile(oldPath)
      }

      // B. Upload FOTO BARU
      const newPaths: string[] = []
      for (const file of imageFiles) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-img-${file.name.replace(/\s+/g, '-')}`
        const filePath = path.join(process.cwd(), "public/uploads", fileName)
        await writeFile(filePath, buffer)
        newPaths.push(`/uploads/${fileName}`)
      }
      finalImagePaths = newPaths
    }

    // --- LOGIKA UPDATE VIDEO ---
    const videoFile = formData.get("video") as File
    let finalVideoPath = existingCar.video

    // Jika ada video baru yang diunggah
    if (videoFile && videoFile.size > 0) {
      // A. Hapus VIDEO LAMA dari folder public
      if (existingCar.video) {
        await deletePhysicalFile(existingCar.video)
      }

      // B. Upload VIDEO BARU
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
      const videoName = `${Date.now()}-video-${videoFile.name.replace(/\s+/g, '-')}`
      const videoFullPath = path.join(process.cwd(), "public/uploads", videoName)
      await writeFile(videoFullPath, videoBuffer)
      finalVideoPath = `/uploads/${videoName}`
    }

    // 3. Update Database dengan data baru (atau data lama jika tidak ada media baru)
    await prisma.car.update({
      where: { id },
      data: {
        brand, model, year, price, mileage, transmission,
        color, licensePlate, taxExpiry, stnkOwnership, description,
        images: finalImagePaths,
        video: finalVideoPath,
      }
    })

    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath(`/cars/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Gagal update mobil:", error)
    return { success: false }
  }
}