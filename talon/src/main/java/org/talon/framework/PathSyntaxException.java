package org.talon.framework;

/**
 * Checked exception thrown to indicate that a string could not be parsed 
 * as a {@link ResourcePath}.
 * 
 * @author nrobertdehault
 * @since 218
 */
public class PathSyntaxException extends TalonException {

    public PathSyntaxException(String message, Throwable cause) {
        super(message, cause);
    }

    public PathSyntaxException(String message) {
        super(message);
    }

    public PathSyntaxException(Throwable cause) {
        super(cause);
    }

}
