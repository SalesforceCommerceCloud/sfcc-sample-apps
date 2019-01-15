package org.talon;

import static org.junit.Assert.assertNotNull;

import org.junit.Test;

public class TalonInfoTest {

    @Test
    public void returnsTalonVersion() {
        assertNotNull(TalonInfo.getTalonVersion());
    }
}
