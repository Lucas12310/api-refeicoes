import AuthService from "../services/AuthService.js";
import CommonResponse from "../utils/commonResponse.js";

class AuthController {
  static Login = async (req, res, next) => {
    try {
      const response = await AuthService.login(req.body);

      res.status(200).json(CommonResponse.success({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        usuario: response.usuario
      }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * @Logout remove o token refresh token do usuário.
   */
  static Logout = async (req, res, next) => {
    try {
      const { userId } = req.body;
      await AuthService.logout(userId);

      res.status(200).json(CommonResponse.success({ message: "Logout realizado com sucesso." }));
    } catch (error) {
      next(error);
    }
  };
  static RefreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      const newTokens = await AuthService.refreshTokens(refreshToken);

      res.status(200).json(CommonResponse.success(newTokens));
    } catch (error) {
      next(error);
    }
  };
  static RevokeToken = async (req, res, next) => {
    try {
      const { userId } = req.body;

      await AuthService.revokeToken(userId);

      res.status(200).json(CommonResponse.success({ message: "Token revogado com sucesso." }));
    } catch (error) {
      next(error);
    }
  };
  static forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.status(200).json(CommonResponse.success());
    } catch (error) {
      next(error);
    }
  }

  static resetPassword = async (req, res, next) => {
    try {
      const { email, code, senha } = req.body;
      const response = await AuthService.resetPassword(email, code, senha);
      
      res.status(200).json(CommonResponse.success(response));
    }
    catch (error) {
      next(error);
    }
  }

}

export default AuthController;