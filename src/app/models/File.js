import {Sequelize, Model} from 'sequelize';

class File extends Model
{
    static init(sequelize)
    {
        super.init
        {
            fileUrl: Sequelize.STRING,
            
        },
        {
            sequelize,
        }
    }
}
