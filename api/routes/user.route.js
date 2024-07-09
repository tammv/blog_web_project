import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  makeAdmin,
  banUser,
  unbanUser,
  updateLevelToPremium
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);
router.put('/:userId/admin', verifyToken, makeAdmin);
router.put('/ban/:userId', verifyToken, banUser);
router.put('/unban/:userId', verifyToken, unbanUser);
router.post('/level/:id', updateLevelToPremium);


export default router;