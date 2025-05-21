import mongoose from 'mongoose';
import Rota from '../models/Rota.js'; 
import permissoes from '../models/Permissoes.js';
import UserRepository from '../repository/UsuarioRepository.js'; 

const AuthPermission = async (req, res, next) => {
  try {
    const { _id } = req.user; 
    
    const { grupo } = await UserRepository.findById(_id); 
    const currentRoute = req.baseUrl + req.route.path; // Rota atual
    const currentMethod = req.method.toUpperCase();

    // console.log('grupo ID do usuário:', _id, grupo);
    // console.log('Rota atual:', currentRoute);
    // console.log('Método atual:', currentMethod);

    const rota = await Rota.findOne({ rota: { $in: [currentRoute] } }); // Verifica se a rota atual está na lista de rotas
    if (!rota) {
      console.error('Rota não encontrada:', currentRoute);
      return res.status(403).json({ msg: 'Rota não encontrada nas permissões.' });
    }
    // console.log('Rota encontrada:', rota);

    // Verificar permissões para o grupo e rota
    const Permissoes = await permissoes.findOne({
      grupo_id: grupo, 
      rota_id: rota._id,
      metodos: { $in: [currentMethod] }, // Verifica se o método atual está na lista de métodos permitidos
    });

    if (!Permissoes) {
      console.error('Permissão não encontrada para grupo:', grupo, 'rota_id:', rota._id, 'método:', currentMethod);
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    // console.log('Permissão encontrada:', Permissoes);
    next(); 
  } catch (error) {
    console.error('Erro no middleware authPermission:', error); 
    return res.status(500).json({ msg: 'Erro interno do servidor.', error: error.message || error });
  }
}

export default AuthPermission;