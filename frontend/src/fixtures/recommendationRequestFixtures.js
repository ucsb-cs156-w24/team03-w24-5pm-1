const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "request1@ucsb.edu",
        "professorEmail": "professor1@ucsb.edu",
        "explanation": "ex1",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2022-01-03T12:00:00",
        "done": "true"
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "request1@ucsb.edu",
            "professorEmail": "professor1@ucsb.edu",
            "explanation": "ex1",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2022-01-03T12:00:00",
            "done": "true"
        },
        {
            "id": 2,
            "requesterEmail": "request2@ucsb.edu",
            "professorEmail": "professor2@ucsb.edu",
            "explanation": "ex2",
            "dateRequested": "2022-08-02T12:00:00",
            "dateNeeded": "2022-10-03T12:00:00",
            "done": "true"
        },
        {
            "id": 3,
            "requesterEmail": "request3@ucsb.edu",
            "professorEmail": "professor3@ucsb.edu",
            "explanation": "ex3",
            "dateRequested": "2022-03-02T12:00:00",
            "dateNeeded": "2022-06-09T12:00:00",
            "done": "false"
        }
    ]
};


export { recommendationRequestFixtures };