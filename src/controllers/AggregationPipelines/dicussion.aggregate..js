import { ObjectId } from "mongodb"
import mongoose from "mongoose"

export const previousMessagesAggregation = (id) =>{
    return [
        {
          $match: {
             room : new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $sort :{
            createdAt : -1
          }
        },
        {
          $limit : 50
        }
        ,
        {
          $project: {
            text : 1,
          file : 1,
          createdAt : 1,
          userName : {
            $arrayElemAt : ['$userDetails.username',0]
          },
          profilepicture : {
            $arrayElemAt : ['$userDetails.profilepicture',0]
          }
          }
        }
      ]
}