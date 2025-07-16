import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
   try {
      const token = req.cookies.token;
      if (!token) {
         return res
            .status(401)
            .json({message: 'No token provided, authorization denied'});
      }
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
   } catch (error) {
      return res
         .status(401)
         .json({message: 'Invalid token', error: error.message});
   }
};
