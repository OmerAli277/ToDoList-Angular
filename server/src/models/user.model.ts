import { Model, Table, AutoIncrement, DataType, PrimaryKey, Column, AllowNull, NotEmpty, Unique, HasMany, Index } from "sequelize-typescript";
import bcrypt from 'bcryptjs';
import todolist from './todolist.model';
@Table(
    {
        tableName: "users",
        timestamps: true
    }
)
export default class User extends Model<User>{
    
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number;
    
    @AllowNull(false)
    @NotEmpty
    @Column
    full_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: 'email'
    })
    email!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    password!: string;

    @HasMany(()=> todolist)
    todolists!: todolist[];

    hashpassword(): void{
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkpasswordhash(unencryptedPassword:string): boolean{
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}