import { ObjectId } from "mongodb";

export const getSolutionAggregation = (id) =>{
    return [
    {
      $match: {
        user : new ObjectId(id)
      }
    },
    {
      $sort : {
        "createdAt" : -1
      }
    },
    {
      $lookup: {
        from: "questions",
        localField: "question",
        foreignField: "_id",
        as: "questionDetails"
      }
    },
    {
      $addFields: {
        questionInfo: {
          $arrayElemAt : ["$questionDetails",0]
        }
      }
    },
    {
      $group : {
        _id : null,
        allSolutions : {
          $push : {
            _id : "$_id",
            questionId : "$question",
            title : "$title",
            questionName : "$questionInfo.questionName",
            createdAt : "$createdAt"
          }
        }
      }
    },
    {
      $lookup: {
        from: "solution_views",
        let : {
          solutionIds : "$allSolutions._id"
        },
        pipeline : [
          {
            $match : {
              $expr : {
                $in : ["$solution", "$$solutionIds"]
              }
            }
          }
        ],
        as: "totalViewsOfSolution"
      }
    },
    {
      $lookup: {
        from: "solution_likes",
        let : {
          solutionIds : "$allSolutions._id"
        },
        pipeline : [
          {
            $match : {
              $expr : {
                $in : ["$solution", "$$solutionIds"]
              }
            }
          }
        ],
        as: "totalLikesOfSolution"
      }
    }
    ,
    {
      $project: {
        solutionList : {
        $slice : ["$allSolutions", 12],
        },
        totalViewsOfSolution : {
          $size : "$totalViewsOfSolution"
        },
        totalLieksOfSolution : {
          $size : "$totalLikesOfSolution"
        },
        totalNumberOfsolution : {
          $size : "$allSolutions"
        }
      }
    }
  ]
}
export const getQuestionSolvedAggregation = (id)=>{
    return [
        {
          $match: {
            user : new ObjectId(id)
          }
        }
        ,
        {
          $group: {
            _id: null,
            solvedQuestionIds : {
              $addToSet : "$question"
            }
          }
        },
        {
          $lookup: {
            from: "questions",
            let : {
              questionIds : "$solvedQuestionIds" 
            },
            pipeline : [
              {
                $match : {  
                    $expr : {
                      $in : ["$_id", "$$questionIds"]
                    }
                }
              },
              {
                $group : {
                  _id : "$level",
                  numberOfQuestion : {
                    $sum : 1
                  }
                }
              }
            ],
            as: "solvedQuestionsInfo"
          }
        },
        {
          $lookup: {
            from: "questions",
            pipeline : [
              {
                $group : {
                  _id : "$level",
                  numberOfQuestions : { $sum : 1}
                }
              }
            ],
            as: "allQuestionsInfo"
          }
        }
        ,
        {
          $project: {
            _id : 0,
            totalQuestionsSolved : {
              $size : "$solvedQuestionIds"
            },
            solvedQuestionsInfo : 1,
            allQuestionsInfo : 1
          }
        }
      ]
}

export const getProfileInfoAggregation = (id) =>{
    return [
        {
          $match : {
            _id : new ObjectId(id)
          }
        },
        {
          $project : {
          username : 1,
          email : 1,
          profilepicture : 1,
          fullname : 1,
          bio : 1,
          location : 1,
          proficientin : 1,
          codinglevel : 1,
          badges : 1,
          college : 1,
          company : 1,
          github : 1,
          linkdin : 1,
          portfolio : 1,
          twitter : 1
          }
        }
      ]
}

export const getSubmissionDateAggregation = (id) =>{
    return [
        {
          $match: {
            user : new ObjectId(id)
          }
        },
        {
          $addFields: {
            submissionDate: {
              $substr : ["$createdAt", 0, 10]
            }
          }
        },
        {
          $group : {
            _id : "$submissionDate",
            submissionCount : {
              $sum : 1
            }
          }
        },
        {
          $project : {
            _id : 0,
            date : "$_id",
            count : "$submissionCount"
          }
        }
      ]
}

export const getSubmissionDetails = (id) => {
  return [
    {
      $match : {
        user : new ObjectId(id)
      }
    },
    {
      $sort : {
        createdAt : -1
      }
    },
    {
      $limit : 12
    },
    {
      $lookup: {
        from: "questions",
        localField: "question",
        foreignField: "_id",
        as: "questionDetail"
      }
    },
    {
      $addFields: {
        questionInfo: {
          $arrayElemAt : ["$questionDetail",0]
        }
      }
    },
    {
      $project : {
        question : 1,
        questionName : "$questionInfo.questionName",
        createdAt : 1,
        status : 1
      }
    }
  ]
}