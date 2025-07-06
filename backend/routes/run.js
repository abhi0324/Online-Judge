import express from 'express';
import { executeCode } from '../utils/executecode.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, language, input } = req.body;
  
  if(!code || !language) {    
    return res.status(400).json({error: 'Code and language are required'});
  }

  try{
    const output = await executeCode(code, language, input);
    return res.json({output});
  }
  catch(error){
    res.status(400).json({output: error});
  }
  
})

export default router;
