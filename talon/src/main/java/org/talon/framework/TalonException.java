package org.talon.framework;

/**
 * Generic Talon checked exception.
 *
 * @author nrobertdehault
 * @since 216
 */
public class TalonException extends Exception {

    public TalonException(String message, Throwable cause) {
        super(message, cause);
    }

    public TalonException(String message) {
        super(message);
    }

    public TalonException(Throwable cause) {
        super(cause);
    }

}
