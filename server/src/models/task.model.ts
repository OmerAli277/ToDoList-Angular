import { Model, Table, AutoIncrement, PrimaryKey, HasMany, Column, AllowNull, NotEmpty, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import todolist from './todolist.model';
@Table(
    {
        tableName: "tasks",
        timestamps: true
    }
)
export default class task extends Model<task> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number

    @Column({
        type: DataType.STRING(120),
        allowNull: false
    })
    name!: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    description!: string

    @ForeignKey(()=> todolist)
    todolistId!: number

    @BelongsTo(()=> todolist)
    todolist!: todolist

}