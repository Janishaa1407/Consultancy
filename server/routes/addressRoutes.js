import { Router } from 'express'
import { createAddress, deleteAddress, listMyAddresses, setDefaultAddress } from '../controllers/addressController.js'
import { requireAuth } from '../middleware/auth.js'

export const addressRoutes = Router()

addressRoutes.get('/my', requireAuth, listMyAddresses)
addressRoutes.post('/', requireAuth, createAddress)
addressRoutes.patch('/:id/default', requireAuth, setDefaultAddress)
addressRoutes.delete('/:id', requireAuth, deleteAddress)

