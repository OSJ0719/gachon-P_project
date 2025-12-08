package AI_Secretary.Exceptions;

public class PolicyNotFoundException extends RuntimeException {
  public PolicyNotFoundException(Long policyId) {
    super("Policy not found. id=" + policyId);
  }
}
