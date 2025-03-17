import { Router } from "express";

//Routes
import saveNewCallRoute from './saveNewCall.route';
import feedbackRoute from './feedback.route';
import authRoute from './auth';
import chatbotRoute from './chatbot.route';
import buyerListRoute from './buyerList.route';
import fetchDataTypeRoute from './fetchDataType.route';
import getCallLogsRoute from './getCallLogs.route';
import callerGuideRoute from './callerGuide.route';
import campaignSetupRoutes from './campaignSetup.route';
import askAboutProductRoute from "./askAboutProduct.route";

const router = Router();

router.use('/save-new-call', saveNewCallRoute);
router.use('/feedback', feedbackRoute);
router.use('/auth', authRoute);
router.use('/chatbot', chatbotRoute);
router.use('/ask-about-product', askAboutProductRoute);
router.use('/buyer-list', buyerListRoute);
router.use('/fetch-data-type', fetchDataTypeRoute);
router.use('/get-call-logs', getCallLogsRoute);
router.use("/guide", callerGuideRoute);
router.use("/campaign", campaignSetupRoutes);


export default router;