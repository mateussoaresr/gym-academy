const db = require('../../config/db')
const {age, date} = require('../../lib/utils')


module.exports = {
    all(callback){

        db.query(`SELECT instructors.*, count(members) AS total_students
        FROM instructors
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        GROUP BY instructors.id 
        ORDER BY total_students DESC`, function(err, results){
            if(err) throw "Database Error!"

            for(row of results.rows){
                
                row.services = row.services.split(",")
            }

            callback(results.rows)
        })
    },
    create(data, callback){
        
        let {avatar_url, name, birth, services, gender} = data
        birth = date(birth).iso
        const created_at = date(Date.now()).iso 
    
        const query =`
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
        const values = [
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at,
        ]

        db.query(query, values, function(err, results){ 
            if(err) throw "Database Error!"

            callback(results.rows[0])
            
        })


    },
     find(id, callback){
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results){
            if(err) throw "Database Error!"
             
            callback(results.rows[0])
        })
    },
    findBy(filter, callback){
        db.query(`SELECT instructors.*, count(members) AS total_students
        FROM instructors
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        WHERE instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
        GROUP BY instructors.id 
        ORDER BY total_students DESC`, function(err, results){
            if(err) throw "Database Error!"

            for(row of results.rows){
                
                row.services = row.services.split(",")
            }

            callback(results.rows)
        })
    },
    update(data, callback){
        const query = `
            UPDATE instructors SET
            name=($1),
            avatar_url=($2),
            gender=($3),
            services=($4),
            birth=($5)
            WHERE id = $6
        `
        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            data.id
        ]

        db.query(query,values,function(err,results){
            if(err) throw "Database Error!"

            callback()

        })
    },
    delete(id, callback){
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(err, results){
            if(err) throw "Database Error!"
            
            return callback()

        })
    },
    paginate(params){
        const {filter, limit, offset, callback} = params


        let query= ""
        let filterQuery= ""
        let totalQuery= `(
                SELECT count(*) FROM instructors
               ) AS total`
        

        if(filter){ 

            filterQuery = `
            WHERE instructors.name ILIKE '%${filter}%'
            OR instructors.services ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM instructors
                ${filterQuery}
               ) as total`
        }

        
        query = `
        SELECT instructors.*, ${totalQuery}, count(members) AS total_students 
        FROM instructors
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        ${filterQuery}
        GROUP BY instructors.id LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results){
            if(err) throw "Database error!" 

            for( row of results.rows){
                row.services = row.services.split(",")
            }

            
            callback(results.rows)
        })
    }
}