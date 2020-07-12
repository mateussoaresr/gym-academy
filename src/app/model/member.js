const db = require('../../config/db')
const {age, date} = require('../../lib/utils')



module.exports = {
    all(callback){

        db.query(`SELECT * FROM members`, function(err, results){
            if(err) throw "Database Error!"

            callback(results.rows)
        })
    },
    create(data, callback){
        
           
        let {avatar_url, name, birth, gender, email, blood, weigth, heigth, instructor} = data
    
        birth = date(birth).iso 
    
        const query =`
            INSERT INTO members (
                avatar_url,
                name,
                birth,
                gender,
                email,
                blood, 
                weigth, 
                heigth,
                instructor_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `
        const values = [
                avatar_url,
                name,
                birth,
                gender,
                email,
                blood, 
                weigth, 
                heigth,
                instructor
        ]

        db.query(query, values, function(err, results){ 
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
            
        })


    },
    find(id, callback){
        db.query(`
            SELECT members.*, instructors.name AS instructor_name
            FROM members
            LEFT JOIN instructors ON (members.instructor_id = instructors.id)
            WHERE members.id = $1`, [id], function(err, results){
                if(err) throw `Database Error!${err}`
                
                callback(results.rows[0])
            })
    },
    update(data, callback){
        const query = `
            UPDATE members SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            gender=($4),
            email=($5),
            blood=($6), 
            weigth=($7), 
            heigth=($8)
            instructor_id=($9)
            WHERE id = $10
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.gender,
            data.email,
            data.blood,
            data.weigth,
            data.heigth,
            data.instructor,
            data.id
            
        ]

        db.query(query,values,function(err,results){
            if(err) throw `Database Error!${err}`

            callback()

        })
    },
    delete(id, callback){
        db.query(`DELETE FROM members WHERE id = $1`, [id], function(err, results){
            if(err) throw "Database Error!"
            
            return callback()

        })
    },
    instructorSelectOptions(callback){
        db.query(`SELECT name, id FROM instructors`, function(err, results){
            if(err) throw "Database error!"

            callback(results.rows)
        })
    },
    paginate(params){
        const {filter, limit, offset, callback} = params


        let query= ""
        let filterQuery= ""
        let totalQuery= `(
                SELECT count(*) FROM members
               ) AS total`
        

        if(filter){ 

            filterQuery = `
            WHERE members.name ILIKE '%${filter}%'
            OR members.email ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM members
                ${filterQuery}
               ) as total`
        }

        
        query = `
        SELECT members.*, ${totalQuery} 
        FROM members
        ${filterQuery}
         LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results){
            if(err) throw "Database error!" 

            
            callback(results.rows)
        })
    }
    

}