"use server";

import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Define the schema for user input validation
const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  status: z.string().min(1, { message: "Status is required" }),
  batch: z.string().min(1, { message: "Batch is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  image: z.instanceof(File).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export type UserFormState = {
  errors?: {
    name?: string[];
    role?: string[];
    email?: string[];
    status?: string[];
    batch?: string[];
    password?: string[];
    image?: string[];
    phoneNumber?: string[];
    address?: string[];
  };
  message?: string | null;
};

export async function addUser(prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  // Parse form data
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const email = formData.get('email') as string;
  const status = formData.get('status') as string;
  const batch = formData.get('batch') as string;
  const password = formData.get('password') as string;
  const image = formData.get('image') as File | null;
  const phoneNumber = formData.get('phoneNumber') as string;
  const address = formData.get('address') as string;

  // Validate form data
  const validatedFields = userSchema.safeParse({
    name,
    role,
    email,
    status,
    batch,
    password,
    image: image || undefined,
    phoneNumber: phoneNumber || undefined,
    address: address || undefined,
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Please check your input.',
    };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: { email: ['A user with this email already exists'] },
        message: 'A user with this email already exists',
      };
    }

    // Handle file upload if image exists
    let imagePath = null;
    if (image) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create a unique filename
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, '-').toLowerCase()}`;
        const publicPath = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(publicPath, filename);
        
        // Ensure the uploads directory exists
        await fs.promises.mkdir(publicPath, { recursive: true });
        
        // Write the file
        await writeFile(filePath, buffer);
        
        // Save the path relative to the public directory
        imagePath = `/uploads/${filename}`;
      } catch (error) {
        console.error('Error uploading image:', error);
        return {
          errors: { image: ['Failed to upload image'] },
          message: 'Failed to upload image',
        };
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    await prisma.user.create({
      data: {
        name,
        role,
        email,
        status,
        batch,
        password: hashedPassword,
        image: imagePath,
        phoneNumber: phoneNumber || null,
        address: address || null,
      },
    });

    // Revalidate the user management page to show the new user
    revalidatePath('/dashboard/user-management');
    
    return { 
      message: 'User created successfully',
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create user',
    };
  }
}

// Add more user-related server actions here as needed
