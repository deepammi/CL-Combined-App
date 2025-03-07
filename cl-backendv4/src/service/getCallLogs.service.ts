/**
 * This service is responsible for fetching data from Call Logs from the S3 bucket.
 */

import { 
    S3Client,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { extractS3Details } from '../utils/s3UrlExtractor';
import { isDev } from "../utils/environment";
import prisma from "../prisma";
import { getAWSCredentials, getAWSS3Config, retryWithExponentialBackoff } from "../utils/aws-credentials";

// Initialize S3 client with our utility function
const s3: S3Client = new S3Client(getAWSS3Config());

const generateSignedUrlForCall = async (callLog: any) => {
    if (!callLog.call_recording) return callLog;

    const keyMatch = callLog.call_recording.match(/connect\/.*$/);
    if (!keyMatch) return callLog;

    const objectKey = keyMatch[0];
    const credentials = getAWSCredentials();

    try {
        // Use retry mechanism for AWS operations
        const signedUrl = await retryWithExponentialBackoff(async () => {
            const command = new GetObjectCommand({
                Bucket: credentials.callsBucket,
                Key: objectKey,
            });
            return await getSignedUrl(s3, command, { expiresIn: 3600 });
        });
        
        return { ...callLog, call_recording: signedUrl };
    } catch (error) {
        console.error(`Error generating signed URL for ${objectKey}:`, error);
        return callLog;
    }
};

export const GetCallLogsService = async (req?: { buyer_id: string, page: string, limit: string }) => {
    const buyerId = req?.buyer_id;
    if (!buyerId) {
        return Promise.reject({ message: "buyer_id is required" });
    }
    
    const queryParams: { skip: number; take: number; where?: any } = {
        skip: req?.page === "1" ? 0 : (parseInt(req?.page as string) - 1) * parseInt(req?.limit as string),
        take: parseInt(req?.limit as string),
        where: {
            buyer_id: buyerId as string,
        },
    };

    try {
        const data = await prisma.call_logs.findMany(queryParams);
        const processedData = await Promise.all(
            data.map((callLog) => generateSignedUrlForCall(callLog))
        );

        return Promise.resolve({ retrievedRows: processedData });
    } catch (error) {
        console.error("Error fetching call logs:", error);
        return Promise.reject({ message: "Failed to fetch call logs" });
    }
}

export const GetSignedUrlForAudio = async (s3Key: string) => {
    if (s3Key === "") {
        return '';
    }
    
    const { key } = extractS3Details(s3Key);
    const credentials = getAWSCredentials();
    
    try {
        // Use retry mechanism for AWS operations
        return await retryWithExponentialBackoff(async () => {
            const command = new GetObjectCommand({
                Bucket: credentials.callsBucket,
                Key: key,
            });
            return await getSignedUrl(s3, command, { expiresIn: 3600 });
        });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return '';
    }
}

