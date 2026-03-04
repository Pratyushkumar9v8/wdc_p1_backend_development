import pool from '../config/db.js'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'; //rowdatapackets ->select , ResultsetHeader -> Insert //rowdatapackets ->select , ResultsetHeader -> Insert

export const findUserByEmail = async (email:string)=>{
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM users where email = ? limit 1",[email]);
    return rows.length ? rows[0] ?? null : null;
}; 
export const createUser = async (userData:any)=>{
    const [result] = await pool.execute<ResultSetHeader>("Insert into users (name,email,password,contact,bio) values (?, ?, ?, ?, ?)",[userData.name, userData.email, userData.password, userData.contact, userData.bio]);
    return result.insertId;
}; 
export const findUserById = async (id:number)=>{
    const [rows] = await pool.execute<RowDataPacket[]>("Select * from users where id = ? limit 1",[id]);
    return rows.length ? rows[0] ?? null : null;
}
export const deleteUserById = async(id:number)=>{
    const [result] = await pool.execute<ResultSetHeader>("Delete from users where id = ?",[id]);
    return result.affectedRows;
}
export const updateUserById = async(id:number,newName:string,newBio:string,newContact:string)=>{
    const [result] = await pool.execute<ResultSetHeader>("update users set name = ?, bio = ?, contact = ? where id = ?" ,[newName,newBio,newContact,id]);
    return result.affectedRows ;
}