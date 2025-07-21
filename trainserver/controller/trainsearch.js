const getTrainData = async (req, res) => {
    const db = req.app.locals.trainDB;
    const trainQuery = req.query.trainQuery;
  
    if (!db || !trainQuery) {
      return res.status(400).json({ error: 'Missing database or trainQuery' });
    }
  
    const isNumber = !isNaN(trainQuery);
    const searchQuery = {
      $or: [
        { train_no: { $regex: trainQuery } },
        { train_name: { $regex: trainQuery, $options: 'i' } }
      ]
    };
    const result0 = await db.collection('trains_detail0')
      .find(searchQuery)
      .limit(5)
      .toArray();
  
    let otherResults = [];
  
    // ✅ If first character is a digit like 1, 2, 3 etc.
    const firstChar = trainQuery[0];
    if (isNumber && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(firstChar)) {
      const collectionIndex = parseInt(firstChar); // e.g., "1" → 1
      const targetCollection = `trains_detail${collectionIndex}`;
   
      try {
        const extra = await db.collection(targetCollection)
          .find(searchQuery)
          .limit(5)
          .toArray();
        otherResults = extra;
      } catch (err) {
        console.warn(`⚠️ Could not search ${targetCollection}:`, err.message);
      }
    }
  
    const combined = [...result0, ...otherResults];
   
  
    res.json(combined);
  };
  
  export default getTrainData