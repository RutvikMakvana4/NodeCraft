```sh

    $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
    }

```

```sh

    { $unwind: "$comments" }

```

```sh

    $project: {
        title: 1,
        content: 1,
        "author.name": 1,
        "author.email": 1
    }

```

```sh

   $group: {
        _id: "$userId",
        totalAmount: { $sum: "$amount" }
    }

```

```sh

    $sort: { age: -1 }

```

```sh

    { $limit: 2 }

```

```sh

    { $skip: 2 }

```

```sh

    {
        $addFields: {
            isAdult: {
                $gte: ["$age", 18]
            }
        }
    }

```

```sh

    $match: {
        age: {
            $gte: 18
        }
    },
    {
        $count: "adultUsers"
    }

```

```sh

    { $replaceRoot: { newRoot: "$address" } }

```

```sh

    # Writes the aggregation result into a new collection.
    { $out: "adultUsers" }

```
