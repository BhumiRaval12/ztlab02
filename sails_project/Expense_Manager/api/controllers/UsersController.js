/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');






module.exports = {
  createAccount: async (req, res) => {
    let {
      name,
      email,
      password
    } = req.body;
    // let tc = true;
    // tc = (tc === 'true') ? true : false;
    const user = await Users.find({
      email: email
    }).limit(1);
    if (user.length >= 1) {
      res.send({
        status: 'failed',
        message: 'Email already exists'
      });

    } else {
      if (name && email && password) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        try {
          await Users.create({
            name: name,
            email: email,
            password: hashpassword


          });
          //await doc.save();
          const saveduser = await Users.findOne({
            email: email
          });



          res
            .status(201)
            .send({
              status: 'success',
              message: 'Registration successfully..',

            });
        } catch (e) {
          console.log(e);
          res.send({
            status: 'failed',
            message: 'Unable to Register',

          });

        }
      } else {
        res.send({
          status: 'failed',
          message: 'password and confirm password are not match!..',
        });
      }

    }
  },


  login: async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;
      if (email && password) {
        const user = await Users.findOne({
          email: email
        });
        if (user !== null) {
          const ismatch = await bcrypt.compare(password, user.password);
          if (user.email === email && ismatch) {
            //genrate token
            const token = jwt.sign({
                userid: user._id
              },
              process.env.JWT_SECRET_KEY, {
                expiresIn: '5d'
              }
            );
            res.send({
              status: 'success',
              message: 'Login Success',
              token: token,
            });
          } else {
            res.send({
              status: 'failed',
              message: 'Email or Password is not valid',
            });
          }
        } else {
          res.send({
            status: 'failed',
            message: 'You are not registerd user'
          });
        }
      } else {
        res.send({
          status: 'failed',
          message: 'All field are required..'
        });
      }
    } catch (error) {
      res.send({
        status: 'failed',
        message: 'Unable to login'
      });
    }
  },

};
