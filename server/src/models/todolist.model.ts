import { Model, Table, AutoIncrement, PrimaryKey, HasMany, Column, AllowNull, NotEmpty, Unique, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import user from './user.model';
import task from './task.model';
@Table(
    {
        tableName: "todolists",
        timestamps: true
    }
)
export default class todolist extends Model<todolist> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number

    @Column({
        type: DataType.STRING(120),
        allowNull: false
    })
    title!: string

    @ForeignKey(() => user)
    @Column
    userId!: number;

    @BelongsTo(() => user)
    user!: user;

    @HasMany(()=> task)
    tasks!: task[];

}