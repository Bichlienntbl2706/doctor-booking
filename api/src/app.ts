import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import ApiError from './errors/apiError';
import router from './app/routes';
import config from './config';

const app: Application = express();

app.use(cors());
app.use(CookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
})

app.get('/', (req: Request, res: Response) => {
    res.send(config.clientUrl)
})

app.use('/api/v1', router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message })
    } else {
        res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: 'Something Went Wrong',
        });
    }
    next();
})

export default app;

// import express, { Application, NextFunction, Request, Response } from 'express';
// import cors from 'cors';
// import CookieParser from 'cookie-parser';
// import httpStatus from 'http-status';
// import ApiError from './errors/apiError';
// import router from './app/routes';
// import config from './config';

// const app: Application = express();

// app.use(cors());
// app.use(CookieParser());

// // Middleware để phân tích dữ liệu JSON từ body của request
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// app.get('/favicon.ico', (req: Request, res: Response) => {
//     res.status(204).end();
// })

// app.get('/', (req: Request, res: Response) => {
//     res.send(config.clientUrl)
// })

// // Đăng ký route kiểm tra
// // app.post('/api/v1/timeslot/create', (req, res) => {
// //     console.log("request body: ", req.body); // Kiểm tra dữ liệu request ở đây
// //     // Xử lý dữ liệu và phản hồi
// //     res.status(200).json({ success: true, data: req.body });
// // });

// // Sử dụng router chính
// app.use('/api/v1', router);

// // Middleware xử lý lỗi
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     if (err instanceof ApiError) {
//         res.status(err.statusCode).json({ success: false, message: err.message })
//     } else {
//         res.status(httpStatus.NOT_FOUND).json({
//             success: false,
//             message: 'Something Went Wrong',
//         });
//     }
//     next();
// })

// export default app;
