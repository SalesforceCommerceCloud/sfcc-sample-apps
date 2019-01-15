package org.talon.test;

import static org.junit.Assert.*;

import java.io.*;

import org.apache.commons.io.FileUtils;

public class GoldFile {

    private static File GOLD_FILES_FOLDER = new File("src/test/gold-files");
    
    private static String UPDATE_GOLD_FILES = "updateGoldFiles";
    
    /**
     * Verify that a gold file matches the given content. 
     * 
     * If the gold file does not exist it is written to the file
     * system and should be versioned. 
     * 
     * To update a gold file, delete it from the file system and run the test
     * or pass -DupdateGoldFiles=true from the command line. 
     * 
     */
    public static void write(String testSuite, String name, String content) throws FileNotFoundException, IOException {
        assertTrue("Cannot find gold files folder: " + GOLD_FILES_FOLDER.getAbsolutePath(), GOLD_FILES_FOLDER.isDirectory());
        
        File goldFile = new File(new File(GOLD_FILES_FOLDER, testSuite), name);
        goldFile.getParentFile().mkdir();
        
        // if the gold file already exists, make sure it did not change
        if (goldFile.exists() && !Boolean.valueOf(System.getProperty(UPDATE_GOLD_FILES))) {
            String currentContent = FileUtils.readFileToString(goldFile, "UTF-8");
            assertEquals("Gold file changed, delete the current file if you mean to update it or pass -DupdateGoldFiles=true from the command line", currentContent, content);
        } else {
	        	// write the file
	        	FileUtils.write(goldFile, content);
        }
        
    }
}
