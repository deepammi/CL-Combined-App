interface S3Details {
    key: string;
    bucket?: string;
}

/**
 * Extracts the key and bucket from an S3 URL
 * Handles different S3 URL formats:
 * - s3://bucket-name/path/to/file
 * - https://bucket-name.s3.region.amazonaws.com/path/to/file
 * - connect/path/to/file (direct key reference)
 */
export const extractS3Details = (url: string): S3Details => {
    // Handle empty or undefined URLs
    if (!url || url === '') {
        return { key: '' };
    }
    
    try {
        // Handle direct key references (no s3:// or https://)
        if (url.startsWith('connect/')) {
            return { key: url };
        }
        
        // Handle s3:// format
        if (url.startsWith('s3://')) {
            const urlWithoutScheme = url.slice(5); 
            const [bucketName, ...keyParts] = urlWithoutScheme.split('/');
            const key = keyParts.join('/');
            
            return { key, bucket: bucketName };
        }
        
        // Handle https:// format
        if (url.startsWith('https://')) {
            // Extract the path from the URL
            const urlObj = new URL(url);
            const path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            
            // Extract bucket from hostname (e.g., bucket-name.s3.region.amazonaws.com)
            const hostnameParts = urlObj.hostname.split('.');
            const bucketName = hostnameParts[0];
            
            return { key: path, bucket: bucketName };
        }
        
        // Default case - treat as direct key
        return { key: url };
    } catch (error) {
        console.error('Error extracting S3 details:', error);
        return { key: url }; // Return the original URL as the key as a fallback
    }
};
  